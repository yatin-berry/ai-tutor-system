import os
import json
import shutil

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DB_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "resume_db")
)

# -----------------------------
# Lazy Load Embedding Model
# -----------------------------
embeddings = None


def get_embeddings():
    global embeddings

    if embeddings is None:
        embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )

    return embeddings


def get_user_db_path(user_id: str) -> str:
    return os.path.join(DB_DIR, user_id)


def get_resume_metadata(user_id: str) -> dict:
    user_dir = get_user_db_path(user_id)
    metadata_path = os.path.join(user_dir, "metadata.json")

    if os.path.exists(metadata_path):
        try:
            with open(metadata_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading metadata: {e}")

    return {"filename": None}


def process_resume(user_id: str, temp_pdf_path: str, original_filename: str) -> dict:
    user_dir = get_user_db_path(user_id)
    os.makedirs(user_dir, exist_ok=True)

    # -----------------------------
    # Load PDF
    # -----------------------------
    try:
        loader = PyPDFLoader(temp_pdf_path)
        pages = loader.load()
    except Exception as e:
        raise ValueError(f"Failed to read PDF: {str(e)}")

    if not pages or all(not page.page_content.strip() for page in pages):
        raise ValueError(
            "The PDF contains no extractable text."
        )

    # -----------------------------
    # Split Text
    # -----------------------------
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    chunks = splitter.split_documents(pages)

    if not chunks:
        raise ValueError("No text chunks generated.")

    # -----------------------------
    # Build Vector Store
    # -----------------------------
    try:
        db = FAISS.from_documents(
            chunks,
            get_embeddings()
        )

        db.save_local(user_dir)

    except Exception as e:
        raise RuntimeError(
            f"Embedding generation failed: {str(e)}"
        )

    # -----------------------------
    # Save Metadata
    # -----------------------------
    metadata = {
        "filename": original_filename,
        "chunk_count": len(chunks)
    }

    with open(
        os.path.join(user_dir, "metadata.json"),
        "w",
        encoding="utf-8",
    ) as f:
        json.dump(metadata, f, indent=4)

    return metadata


def retrieve_context(user_id: str, query: str):
    user_dir = get_user_db_path(user_id)

    if not os.path.exists(
        os.path.join(user_dir, "index.faiss")
    ):
        return None

    try:
        db = FAISS.load_local(
            user_dir,
            get_embeddings(),
            allow_dangerous_deserialization=True,
        )

        retriever = db.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4},
        )

        docs = retriever.invoke(query)

        return "\n\n".join(
            doc.page_content
            for doc in docs
        )

    except Exception as e:
        print(f"Retrieval error: {e}")
        return None


def delete_user_resume(user_id: str) -> bool:
    user_dir = get_user_db_path(user_id)

    if os.path.exists(user_dir):
        try:
            shutil.rmtree(user_dir)
            return True
        except Exception as e:
            print(f"Delete error: {e}")
            return False

    return False