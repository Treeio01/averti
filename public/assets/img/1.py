
import os
import sys
import pathlib
import requests

# ================== НАСТРОЙКИ ==================

# Твой public key из iLoveAPI (консоль → API Keys → Project public key)
ILOVEAPI_PUBLIC_KEY = "project_public_c00fccaf9fa8cd4d0d57e3c92611d6ae_VzugLfc8cdf775055f2451b1518f9f9140305"


# Регион обработки файлов: eu, us, fr, de, pl
REGION = "eu"

# Уровень сжатия: "extreme", "recommended", "low"
COMPRESSION_LEVEL = "recommended"

# Какие расширения считаем картинками
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".tif", ".tiff"}

# =================================================


def get_token(public_key: str) -> str:
    """Получаем JWT-токен по public_key (/auth)."""
    if not public_key or "ВСТАВЬ_СВОЙ" in public_key:
        raise RuntimeError("Не задан ILOVEAPI_PUBLIC_KEY. Укажи его в коде или через переменную окружения.")

    url = "https://api.ilovepdf.com/v1/auth"
    resp = requests.post(url, data={"public_key": public_key})
    try:
        resp.raise_for_status()
    except requests.HTTPError:
        print("Ошибка при /auth:", resp.status_code, resp.text)
        raise
    data = resp.json()
    return data["token"]


def start_task(token: str, region: str):
    """
    Создаём задачу compressimage и получаем server + task id.

    ВАЖНО: /v1/start/{tool}/{region} нужно дергать GET-ом.
    """
    url = f"https://api.ilovepdf.com/v1/start/compressimage/{region}"
    headers = {"Authorization": f"Bearer {token}"}

    # Start должен быть GET, не POST
    resp = requests.get(url, headers=headers)
    try:
        resp.raise_for_status()
    except requests.HTTPError:
        print("Ошибка при /start:", resp.status_code, resp.text)
        raise

    data = resp.json()
    return data["server"], data["task"]


def upload_file(server: str, task_id: str, token: str, path: pathlib.Path) -> str:
    """Заливаем файл в task, возвращаем server_filename."""
    url = f"https://{server}/v1/upload"
    headers = {"Authorization": f"Bearer {token}"}
    with path.open("rb") as f:
        files = {"file": (path.name, f)}
        data = {"task": task_id}
        resp = requests.post(url, headers=headers, files=files, data=data)
    try:
        resp.raise_for_status()
    except requests.HTTPError:
        print(f"Ошибка при /upload ({path}):", resp.status_code, resp.text)
        raise
    return resp.json()["server_filename"]


def process_compressimage(server: str, task_id: str, token: str,
                          server_filename: str, filename: str, compression_level: str):
    """Стартуем обработку compressimage для одного файла."""
    url = f"https://{server}/v1/process"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "task": task_id,
        "tool": "compressimage",
        "files": [
            {
                "server_filename": server_filename,
                "filename": filename,
            }
        ],
        # extra-параметр для Compress Image
        "compression_level": compression_level,  # extreme | recommended | low
    }
    resp = requests.post(url, headers=headers, json=payload)
    try:
        resp.raise_for_status()
    except requests.HTTPError:
        print(f"Ошибка при /process ({filename}):", resp.status_code, resp.text)
        raise
    return resp.json()


def download_result(server: str, task_id: str, token: str, dest_path: pathlib.Path):
    """
    Скачиваем результат: если один выходной файл — API отдаёт сразу файл, без ZIP.
    Сохраняем во временный файл и потом атомарно заменяем оригинал.
    """
    url = f"https://{server}/v1/download/{task_id}"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers, stream=True)
    try:
        resp.raise_for_status()
    except requests.HTTPError:
        print(f"Ошибка при /download ({dest_path}):", resp.status_code, resp.text)
        raise

    tmp_path = dest_path.with_suffix(dest_path.suffix + ".tmp_iloveapi")
    with tmp_path.open("wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    # Перезаписываем оригинал
    tmp_path.replace(dest_path)


def is_image_file(path: pathlib.Path) -> bool:
    return path.suffix.lower() in IMAGE_EXTENSIONS


def compress_single_image(path: pathlib.Path, token: str):
    """Полный цикл compressimage для одного файла."""
    server, task_id = start_task(token, REGION)
    server_filename = upload_file(server, task_id, token, path)
    process_compressimage(server, task_id, token, server_filename, path.name, COMPRESSION_LEVEL)
    download_result(server, task_id, token, path)


def walk_and_compress(root_dir: pathlib.Path):
    """Обходит все файлы в директории (рекурсивно) и сжимает только изображения."""
    token = get_token(ILOVEAPI_PUBLIC_KEY)
    print(f"Токен получен. Начинаю обход: {root_dir}")

    for dirpath, _, filenames in os.walk(root_dir):
        for name in filenames:
            file_path = pathlib.Path(dirpath) / name
            if not is_image_file(file_path):
                continue

            try:
                print(f"[PROCESS] {file_path}")
                compress_single_image(file_path, token)
                print(f"[OK] {file_path} — сжато и перезаписано")
            except Exception as e:
                print(f"[ERROR] {file_path}: {e}")


def main():
    if len(sys.argv) > 1:
        # python compress_images_iloveapi.py /path/to/dir
        base_dir = pathlib.Path(sys.argv[1]).resolve()
    else:
        # По умолчанию — текущая директория
        base_dir = pathlib.Path(".").resolve()

    if not base_dir.exists():
        print(f"Директория не найдена: {base_dir}")
        sys.exit(1)

    walk_and_compress(base_dir)


if __name__ == "__main__":
    main()
