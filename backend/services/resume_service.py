import os
import json
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "resume_db"))

# Initialize Embeddings globally to save load time on requests
# We use a standard sentence-transformers model
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

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
            print(f"Error reading metadata for user {user_id}: {e}")
    return {"filename": None}

def process_resume(user_id: str, temp_pdf_path: str, original_filename: str) -> dict:
    user_dir = get_user_db_path(user_id)
    os.makedirs(user_dir, exist_ok=True)

    # 1. Load PDF
    try:
        loader = PyPDFLoader(temp_pdf_path)
        pages = loader.load()
    except Exception as e:
        raise ValueError(f"Failed to read PDF file: {str(e)}")

    if not pages or all(not page.page_content.strip() for page in pages):
        raise ValueError("The PDF file appears to be empty or contains no extractable text.")

    # 2. Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    chunks = text_splitter.split_documents(pages)

    if not chunks:
        raise ValueError("No text chunks could be extracted from the PDF.")

    # 3. Create FAISS Vector store and save locally
    try:
        db = FAISS.from_documents(chunks, embeddings)
        db.save_local(user_dir)
    except Exception as e:
        raise RuntimeError(f"Failed to generate embeddings or build vector index: {str(e)}")

    # 4. Save metadata
    metadata = {
        "filename": original_filename,
        "chunk_count": len(chunks)
    }
    metadata_path = os.path.join(user_dir, "metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    return metadata

def retrieve_context(user_id: str, query: str) -> str:
    user_dir = get_user_db_path(user_id)
    index_path = os.path.join(user_dir, "index.faiss")
    
    if not os.path.exists(index_path):
        return None

    try:
        db = FAISS.load_local(user_dir, embeddings, allow_dangerous_deserialization=True)
        retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})
        docs = retriever.invoke(query)
        
        # Combine retrieved chunks
        context = "\n\n".join([doc.page_content for doc in docs])
        return context
    except Exception as e:
        print(f"Retrieval error for user {user_id}: {str(e)}")
        return None

def delete_user_resume(user_id: str) -> bool:
    user_dir = get_user_db_path(user_id)
    if os.path.exists(user_dir):
        try:
            shutil.rmtree(user_dir)
            return True
        except Exception as e:
            print(f"Error deleting user resume dir {user_dir}: {e}")
            return False
    return False
