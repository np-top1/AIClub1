import os
from pathlib import Path

import modal


SITE_DIRECTORY = Path(
    os.environ.get("PARDO_MODAL_SITE_DIRECTORY", "/tmp/pardo-modal-preview")
).resolve()

app = modal.App("pardo-family-archive")
image = (
    modal.Image.debian_slim()
    .pip_install("fastapi")
    .add_local_dir(str(SITE_DIRECTORY), remote_path="/srv/archive", copy=True)
)


def create_web_app(archive_directory="/srv/archive"):
    from fastapi import FastAPI
    from fastapi.staticfiles import StaticFiles

    web_app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    web_app.mount("/", StaticFiles(directory=archive_directory, html=True), name="family-archive")
    return web_app


@app.function(image=image)
@modal.concurrent(max_inputs=100)
@modal.asgi_app()
def family_archive():
    return create_web_app()
