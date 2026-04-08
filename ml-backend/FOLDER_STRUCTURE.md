Folder Structure

Organize your backend into clear folders:

app/ – Inference and FastAPI

api/ → FastAPI routes (thin, request/response)

core/ → configuration, logging, startup hooks

schemas/ → Pydantic models for request and response

models/ → ML model wrappers for joblib/torch

pipelines/ → orchestrates models and services

services/ → business logic connecting pipelines and models


ml/ – Offline training and experimentation

datasets/ → raw and processed training datasets

preprocessing/ → text cleaning, labeling, encoding scripts

feature_engineering/ → feature creation and transformation

training/ → scripts for training each ML model

evaluation/ → metrics calculation and validation scripts

artifacts/ → saved joblib or transformer models


data/ – Data storage

raw/ → resumes, job roles, skill taxonomy, resources

processed/ → feature tables, embeddings, vectors

external/ → course catalogs, market demand, reference data


scripts/ – One-off utilities

Training orchestration

Embedding building

Smoke testing


tests/ – Unit tests for models, pipelines, API

notebooks/ – Experiments, proof of concepts