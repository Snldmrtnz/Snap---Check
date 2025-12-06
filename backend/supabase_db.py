import os
from supabase import create_client, Client

SUPABASE_URL = 'https://rkbwlgeojhokdrhthlpi.supabase.co'
SUPABASE_KEY = 'sb_secret_WNXXvN-4dm9EizeAz8S51g_UTK8f0TJ'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_exam(exam_type, subject_name, name, section, score):
    data = {
        "exam_type": exam_type,
        "subject_name": subject_name,
        "name": name,
        "section": section,
        "score": score
    }
    response = supabase.table("exams").insert(data).execute()
    return response

def get_exams():
    response = supabase.table("exams").select("*").execute()
    return response.data
