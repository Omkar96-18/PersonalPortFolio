from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from main.app.models import UserProfile, Skill, Project, Blog, Experience, TerminalCommand, ContactSubmission
from main.app.serializers import (
    UserSerializer,
    UserProfileSerializer,
    SkillSerializer,
    ProjectSerializer,
    BlogSerializer,
    ExperienceSerializer,
    TerminalCommandSerializer,
    ContactSubmissionSerializer
)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            user = User.objects.filter(is_superuser=True).first() or User.objects.first()
            if user:
                profile = UserProfile.objects.create(
                    user=user,
                    name=user.username.capitalize(),
                    title="AI/ML Engineer & Backend Developer",
                    bio="Dynamic developer working on AI/ML and Backend systems.",
                    about_me="### About Me\nWelcome to my portfolio! Edit this about section in the Admin Dashboard."
                )
                queryset = UserProfile.objects.filter(id=profile.id)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "slug"

    def get_object(self):
        lookup_url_kwarg = self.kwargs.get(self.lookup_field)
        if lookup_url_kwarg and lookup_url_kwarg.isdigit():
            self.lookup_field = "pk"
        return super().get_object()

class BlogViewSet(viewsets.ModelViewSet):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Blog.objects.all()
        return Blog.objects.filter(is_published=True)

    def get_object(self):
        lookup_url_kwarg = self.kwargs.get(self.lookup_field)
        if lookup_url_kwarg and lookup_url_kwarg.isdigit():
            self.lookup_field = "pk"
        return super().get_object()

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TerminalCommandViewSet(viewsets.ModelViewSet):
    queryset = TerminalCommand.objects.all()
    serializer_class = TerminalCommandSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            default_cmds = [
                {
                    "command": "neofetch",
                    "response": "devil37@portfolio\n----------------\nOS:      Debian GNU/Linux 12\nKernel:  6.1.0-21-amd64\nShell:   bash 5.2.15\nStack:   Django, DRF, FastAPI, Go, PyTorch\nFocus:   AI Agent Workflows & Scalable Backends",
                    "description": "System architecture overview and neofetch banner",
                    "order": 1
                },
                {
                    "command": "help",
                    "response": "Available commands: help, whoami, skills, projects, neofetch, clear",
                    "description": "Lists available terminal commands",
                    "order": 2
                },
                {
                    "command": "whoami",
                    "response": "devil37 (Omkar Pardeshi) - AI/ML Engineer & Backend Architect. Builds context-aware agentic systems (RAG, CrewAI) and low-latency APIs.",
                    "description": "Prints engineer background and focus",
                    "order": 3
                },
                {
                    "command": "skills",
                    "response": "Languages: Python, Go, SQL, Javascript\nBackend: Django, DRF, FastAPI, Flask\nAI/ML: PyTorch, TensorFlow, NLP, RAG, CrewAI\nAutomation: n8n, clawbot",
                    "description": "Prints primary technical stack",
                    "order": 4
                },
                {
                    "command": "projects",
                    "response": "1. Agentic AI Operations Platform (FastAPI, n8n, CrewAI)\n2. Distributed RAG Engine (Go, PyTorch, PostgreSQL)\nScroll down to 'Featured Projects' grid to review full specs!",
                    "description": "Lists featured portfolio projects",
                    "order": 5
                }
            ]
            for cmd in default_cmds:
                TerminalCommand.objects.create(**cmd)
            queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [permissions.IsAdminUser]

class ContactSubmissionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name = request.data.get("name", "").strip()
        email = request.data.get("email", "").strip()
        subject = request.data.get("subject", "").strip() or "General Inquiry"
        message = request.data.get("message", "").strip()

        if not name or not email or not message:
            return Response(
                {"error": "Please fill out your name, email, and message."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Save submission to database
        submission = ContactSubmission.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        # 2. Dispatch Thank-You Confirmation Email to Visitor via SMTP
        email_sent = False
        try:
            visitor_subject = f"Thank you for getting in touch, {name}! [devil37 Portfolio]"
            visitor_text = f"Hi {name},\n\nThank you for reaching out! I have received your message regarding '{subject}' and will get back to you shortly.\n\nYour Submitted Message:\n{message}\n\nBest regards,\nOmkar Pardeshi (devil37)\nAI/ML Engineer & Backend Architect"
            
            visitor_html = f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070709; color: #E2E8F0; border-radius: 10px; overflow: hidden; border: 1px solid #800A1C; box-shadow: 0 8px 25px rgba(246, 36, 64, 0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #F62440 0%, #800A1C 100%); padding: 24px 30px; text-align: left;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">devil37 <span style="color: #000000; font-size: 14px; font-family: monospace; margin-left: 8px;">// SYSTEM ACKNOWLEDGMENT</span></h1>
  </div>
  
  <!-- Body Content -->
  <div style="padding: 30px; line-height: 1.6;">
    <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Hello {name},</h2>
    
    <p style="color: #94A3B8; font-size: 15px;">Thank you so much for exploring my portfolio and taking the time to reach out. I truly appreciate your interest and am grateful for the opportunity to connect with you.</p>
    
    <p style="color: #94A3B8; font-size: 15px;">I have safely received your inquiry regarding <strong>"{subject}"</strong>. For your records, here is a quick log of your message:</p>
    
    <!-- Message Data Box -->
    <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #F62440; padding: 16px 20px; border-radius: 6px; margin: 20px 0; color: #CBD5E1; font-size: 14px;">
      <strong style="color: #F62440; font-family: monospace; display: block; margin-bottom: 6px; letter-spacing: 0.5px;">> YOUR SUBMITTED MESSAGE:</strong>
      <span style="font-style: italic;">{message.replace('\n', '<br/>')}</span>
    </div>
    
    <p style="color: #94A3B8; font-size: 15px; margin-bottom: 30px;">I will carefully review your notes and you can expect a thoughtful reply from me at <strong>{email}</strong> very soon. Thank you again for your time!</p>
    
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
    
    <!-- Sign-off -->
    <p style="color: #FFFFFF; font-weight: 700; margin: 0; font-size: 14px;">Omkar Pardeshi (devil37)</p>
    <p style="color: #F62440; font-size: 12px; font-family: monospace; margin: 4px 0 0 0; letter-spacing: 0.5px;">AI/ML Engineer & Backend Architect</p>
  </div>
  
</div>
            """

            visitor_msg = EmailMultiAlternatives(
                subject=visitor_subject,
                body=visitor_text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            visitor_msg.attach_alternative(visitor_html, "text/html")
            visitor_msg.send(fail_silently=False)
            email_sent = True

            # Also notify admin / site owner if email_host_user is available
            if settings.EMAIL_HOST_USER and settings.EMAIL_HOST_USER != email:
                admin_subject = f"[New Visitor Inquiry] {name} sent a message regarding '{subject}'"
                admin_text = f"New Inquiry Received!\n\nName: {name}\nEmail: {email}\nSubject: {subject}\n\nMessage:\n{message}"
                admin_msg = EmailMultiAlternatives(
                    subject=admin_subject,
                    body=admin_text,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[settings.EMAIL_HOST_USER]
                )
                admin_msg.send(fail_silently=True)

        except Exception as e:
            print(f"SMTP Email Exception: {e}")
            email_sent = False

        return Response({
            "success": True,
            "message": f"Thank you, {name}! Your message has been sent successfully. A confirmation email has been dispatched to {email}.",
            "email_sent": email_sent
        }, status=status.HTTP_201_CREATED)


class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get("file") or request.FILES.get("resume")
        if not file_obj:
            return Response({"error": "No file was provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        import os
        from django.core.files.storage import default_storage

        # Ensure media/resumes directory exists
        resumes_dir = os.path.join(settings.MEDIA_ROOT, "resumes")
        os.makedirs(resumes_dir, exist_ok=True)
        
        # Clean file name
        safe_name = os.path.basename(file_obj.name).replace(" ", "_")
        filename = f"resumes/{safe_name}"
        
        # Remove existing file with same name if exists
        if default_storage.exists(filename):
            default_storage.delete(filename)
            
        saved_path = default_storage.save(filename, file_obj)
        file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)
        
        # Update profile if available
        profile = getattr(request.user, "profile", None)
        if not profile:
            profile = UserProfile.objects.first()
        if profile:
            profile.resume_url = file_url
            profile.save()

        return Response({
            "success": True,
            "file_url": file_url,
            "message": "Resume PDF uploaded and saved successfully!"
        }, status=status.HTTP_201_CREATED)

