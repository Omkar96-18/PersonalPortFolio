import datetime
from django.contrib.auth.models import User
from main.app.models import UserProfile, Skill, Project, Blog, Experience

def seed():
    # 1. Setup User and UserProfile
    user = User.objects.filter(username="devil").first()
    if not user:
        user = User.objects.create_superuser("devil", "devil@example.com", "adminpass")
    
    profile, created = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            "name": "devil37",
            "title": "AI/ML Engineer | Data Scientist | Backend Developer",
            "bio": "Specializing in building high-performance backend microservices and deploying advanced agentic AI, NLP, and Deep Learning pipelines.",
            "about_me": """### Hello World! I'm devil37.

I bridge the gap between complex machine learning architectures and scalable production backends. With expertise spanning from **Django** and **Golang** to **PyTorch**, **TensorFlow**, and **Agentic RAG pipelines (CrewAI, n8n)**, I design intelligent, automated systems.

#### Core Philosophy
- **Scalability**: High-throughput microservices using FastAPI and Go.
- **Intelligence**: Context-aware RAGs and multi-agent systems for workflow automation.
- **Analytics**: Turning unstructured data into actionable insights using modern NLP and ML frameworks.
""",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
            "github_url": "https://github.com",
            "linkedin_url": "https://linkedin.com",
            "resume_url": "https://example.com/resume.pdf",
            "email": "omkarp.0906@gmail.com",
            "location": "Maharashtra, India"
        }
    )
    if not created:
        profile.name = "devil37"
        profile.title = "AI/ML Engineer | Data Scientist | Backend Developer"
        profile.bio = "Specializing in building high-performance backend microservices and deploying advanced agentic AI, NLP, and Deep Learning pipelines."
        profile.avatar_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300"
        profile.save()

    # 2. Add Skills
    skills_data = [
        # Languages
        ("Python", "languages", "Expert", "Terminal", 10),
        ("Golang", "languages", "Advanced", "Code", 20),
        ("SQL", "languages", "Expert", "Database", 30),
        ("JavaScript", "languages", "Advanced", "Cpu", 40),
        # Backend
        ("Django / DRF", "backend", "Expert", "Server", 10),
        ("FastAPI", "backend", "Expert", "Zap", 20),
        ("Flask", "backend", "Advanced", "Wind", 30),
        # Frontend
        ("React", "frontend", "Advanced", "Layers", 10),
        ("Next.js", "frontend", "Intermediate", "Compass", 20),
        ("HTML5 & Vanilla CSS", "frontend", "Expert", "PenTool", 30),
        # AI/ML & Data Science
        ("Data Science & Analytics", "ai_ml", "Expert", "BarChart", 10),
        ("Machine Learning (Scikit-learn)", "ai_ml", "Expert", "TrendingUp", 20),
        ("TensorFlow / Keras", "ai_ml", "Advanced", "Grid", 30),
        # Advanced AI
        ("PyTorch (Deep Learning)", "advanced_ai", "Expert", "Activity", 10),
        ("NLP (Natural Language Processing)", "advanced_ai", "Expert", "MessageSquare", 20),
        ("RAGs & Vector Databases", "advanced_ai", "Expert", "Database", 30),
        ("CrewAI (Agentic Workflows)", "advanced_ai", "Expert", "Users", 40),
        # Tools & DevOps
        ("n8n Automation", "tools", "Expert", "Workflow", 10),
        ("Clawbot & Web Scraping", "tools", "Advanced", "Compass", 20),
        ("PostgreSQL (Supabase)", "tools", "Expert", "Database", 30),
        ("Docker & CI/CD", "tools", "Advanced", "Layers", 40),
    ]

    Skill.objects.all().delete()
    for name, cat, prof, icon, order in skills_data:
        Skill.objects.create(name=name, category=cat, proficiency=prof, icon=icon, order=order)

    # 3. Add Experiences
    Experience.objects.all().delete()
    Experience.objects.create(
        role="Lead AI & Backend Engineer",
        company="Cognitive Systems Inc.",
        location="Remote",
        start_date=datetime.date(2024, 6, 1),
        is_current=True,
        description="""Designed and built multi-agent workflows using CrewAI and n8n to automate operations.
Developed high-performance RAG query engines using FastAPI and PgVector.
Maintained backend core platforms using Django and Go microservices.
Optimized NLP transformer model deployments leading to 40% inference speedups.""",
        order=10
    )
    Experience.objects.create(
        role="Data Scientist",
        company="Insight Analytics Corp",
        location="Austin, TX",
        start_date=datetime.date(2022, 3, 15),
        end_date=datetime.date(2024, 5, 30),
        is_current=False,
        description="""Led a team of data analysts analyzing customer churn using Deep Learning (TensorFlow).
Maintained automated ETL data pipelines in Python and SQL.
Implemented internal Flask and Dash tools for real-time model evaluation.""",
        order=20
    )

    # 4. Add Projects
    Project.objects.all().delete()
    Project.objects.create(
        title="Agentic AI Operations Platform",
        slug="agentic-ai-operations",
        description="A orchestrator for web agents and workflow automation using CrewAI and n8n to automate digital workflows.",
        long_description="""### Agentic AI Operations Platform

This project is a state-of-the-art automation hub that connects agentic workflows (CrewAI) with visual pipeline builders (n8n) and web actions (clawbot). 

#### Core Features
- **Multi-Agent Orchestration**: Utilizes CrewAI to coordinate agents with specialized tasks (research, writing, coding).
- **Visual Workflows**: Integrates n8n for webhook parsing, scheduling, and third-party API connectivity.
- **Backend API**: Engineered with FastAPI for async websocket triggers and high throughput.
- **Frontend Panel**: React dashboard built with clean graphs showing real-time token usage and run histories.
""",
        image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=400",
        github_url="https://github.com",
        demo_url="https://example.com",
        tech_stack="FastAPI, CrewAI, n8n, React, PostgreSQL",
        order=10
    )
    Project.objects.create(
        title="Scalable Distributed RAG Engine",
        slug="scalable-distributed-rag",
        description="High-performance document indexing and Retrieval-Augmented Generation pipeline using PyTorch, PGVector, and Go.",
        long_description="""### Distributed RAG Engine

A production-grade Retrieval-Augmented Generation (RAG) framework optimized for sub-100ms semantic search over millions of PDFs.

#### Architecture
- **Ingestion Pipeline**: Go-based worker queue that parses, cleans, and chunks text files asynchronously.
- **Embedding Generation**: PyTorch transformer models running in batch jobs.
- **Storage**: Supabase PostgreSQL with `pgvector` index configuration.
- **Django Management**: Django rest framework dashboard managing collections, user API keys, and limits.
""",
        image_url="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600&h=400",
        github_url="https://github.com",
        demo_url="",
        tech_stack="Django, Golang, PyTorch, Supabase, PgVector",
        order=20
    )

    # 5. Add Blogs
    Blog.objects.all().delete()
    Blog.objects.create(
        title="Demystifying Agentic Workflows: CrewAI meets n8n",
        slug="demystifying-agentic-workflows-crewai-n8n",
        excerpt="An in-depth guide on connecting CrewAI agents with n8n visual automation to build highly interactive self-healing pipelines.",
        content="""### Introduction to Agentic Workflows

Modern automation has evolved from simple trigger-action workflows (e.g., 'If this, then that') to **autonomous agents** that can reason, choose tools, and handle errors dynamically.

In this blog post, we look at how to build an enterprise content pipeline that:
1. Receives a topic trigger from a webhook.
2. Uses a **n8n** workflow to coordinate steps.
3. Delegates research and drafting to a multi-agent team via **CrewAI**.
4. Delivers the result to a database and Slack.

```python
from crewai import Agent, Task, Crew

# Define a research agent
researcher = Agent(
    role="Research Analyst",
    goal="Gather precise information on tech topics",
    backstory="You are an expert researcher with a keen eye for details.",
    verbose=True
)
```

#### Why CrewAI and n8n?
- **CrewAI** is fantastic at code-level agent coordination, memory, and LLM orchestration.
- **n8n** provides the visual structure, native integrations (Slack, Gmail, databases), and error handlers that keep systems reliable.

Stay tuned for part two where we deploy clawbot web agents to fetch data from gated sites!
""",
        cover_image_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=400",
        tags="Agentic AI, CrewAI, n8n, Python",
        is_published=True
    )
    Blog.objects.create(
        title="FastAPI vs Golang: Selecting the backend for high-throughput AI APIs",
        slug="fastapi-vs-go-high-throughput-ai",
        excerpt="Analyzing latency, developer speed, and async performance for serving deep learning inference models in production.",
        content="""### The Dilemma: Python (FastAPI) or Go?

When deploying Machine Learning models, we face a common architectural fork:
- Should we write the API in **Python** (FastAPI) because our ML code (PyTorch, TensorFlow) is in Python?
- Should we write it in **Golang** because of its concurrency model, memory safety, and raw speed?

#### Performance Comparison
Below is a typical response-time distribution under a load of 10,000 concurrent requests:

| Framework | Average Latency | Concurrency Handling | ML Library Integration |
|-----------|-----------------|----------------------|-----------------------|
| FastAPI   | 142ms           | Excellent (asyncio)  | Native / Direct       |
| Go        | 12ms            | Outstanding (goroutine)| CGo / ONNX Runtime   |

#### Recommended Architecture
For maximum efficiency, we recommend a **hybrid approach**:
1. Use **Go** for the public gateway, authentication, rate limiting, and database connections.
2. Deploy the **PyTorch** models inside a microservice in **FastAPI** (or Triton Inference Server).
3. Connect them via **gRPC** or raw TCP sockets.
""",
        cover_image_url="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600&h=400",
        tags="FastAPI, Golang, PyTorch, System Design",
        is_published=True
    )

    Blog.objects.create(
        title="Scaling Natural Language Processing: Transformers, Vector DBs, and Agentic RAG",
        slug="scaling-nlp-transformers-vector-dbs-agentic-rag",
        excerpt="Exploring modern NLP pipelines: from fine-tuning transformer models with PyTorch to indexing vector embeddings for context-aware RAG agents.",
        content="""### The NLP Evolution: Transformers & Semantic Search

Today, Natural Language Processing goes far beyond regex patterns and TF-IDF vectors. With the rise of attention-based architectures, developers can build systems that understand contextual semantics.

In this deep-dive, we look at how to construct a context-aware search engine using:
1. **Embedding Models**: Running local sentence-transformers (PyTorch) to generate 768-dimensional document vectors.
2. **Indexing (Vector Databases)**: Storing and indexing vectors in **PostgreSQL** using `pgvector` with HNSW indices.
3. **Retrieval-Augmented Generation (RAG)**: Querying the database to fetch relevant documents and feeding them to an LLM for structured answers.

#### Ingestion Code Sample

Here is a typical workflow using PyTorch to calculate text embeddings:

```python
import torch
from transformers import AutoTokenizer, AutoModel

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

def get_embedding(text):
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    # Mean pooling to get 1D vector
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
```

#### Structuring the Retrieval Step
To avoid LLM hallucinations, we inject exact matches retrieved from PGVector. By calculating the cosine distance between the user's question embedding and your cached document blocks, you retrieve highly relevant paragraphs.
""",
        cover_image_url="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600&h=400",
        tags="NLP, PyTorch, RAG, Python",
        is_published=True
    )

    Blog.objects.create(
        title="Orchestrating Real-Time Computer Vision Pipelines: YOLOv8 on Edge Devices",
        slug="orchestrating-cv-pipelines-yolov8-edge",
        excerpt="Comparing edge inference runtimes like ONNX and TensorRT and building multi-threaded frame processing queues in Python.",
        content="""### Computer Vision at the Edge

Orchestrating high-frame-rate (FPS) deep learning object detection models in production presents unique challenges:
- How do we handle raw RTSP camera streams without dropping frames?
- How do we optimize network weight sizes to run on low-power devices?

#### Edge Runtime Optimization
Before deploying a **YOLOv8** model, compile the weights into an optimized runtime:

| Weight Format | Device Target | Latency (ms) | Notes |
|---------------|---------------|--------------|-------|
| PyTorch (.pt) | CPU / GPU     | 45ms         | Heavy memory usage |
| ONNX Runtime  | CPU / Intel   | 18ms         | Highly portable |
| TensorRT      | NVIDIA Jetson | 3ms          | Maximum optimization |

#### Frame Processing Queue Architecture
Never run camera frame decoding and model inference in a single execution thread! If your model takes 30ms to infer, you will block the frame decoder, causing lag in the video stream.

We recommend a **multi-threaded architecture**:
1. **Thread A (Decoder)**: Continuously reads frames from camera and puts them into a thread-safe Queue (dropping old frames if queue exceeds length).
2. **Thread B (Inference)**: Pulls frames from the Queue, runs ONNX inference, and returns coordinates.
3. **Thread C (Writer)**: Overlays labels and streams out the output.
""",
        cover_image_url="https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600&h=400",
        tags="Computer Vision, TensorFlow, ONNX, Edge AI",
        is_published=True
    )

    print("Database seeded successfully with profile, skills, experiences, projects, and blogs!")

if __name__ == "__main__":
    seed()
