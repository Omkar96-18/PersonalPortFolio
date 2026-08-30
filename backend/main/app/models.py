from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200, help_text="e.g. AI/ML Engineer | Data Scientist")
    bio = models.TextField(help_text="Short introductory bio")
    about_me = models.TextField(help_text="Detailed markdown about me section")
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    favicon_url = models.URLField(max_length=500, blank=True, null=True, help_text="Custom site favicon / tab title image URL (PNG, SVG, ICO)")
    site_title = models.CharField(max_length=200, blank=True, null=True, help_text="Custom browser tab title and SEO title")
    seo_keywords = models.CharField(max_length=500, blank=True, null=True, help_text="Comma-separated SEO keywords")
    seo_description = models.TextField(blank=True, null=True, help_text="SEO meta description for search engines and social cards")
    github_url = models.CharField(max_length=500, blank=True, null=True)
    linkedin_url = models.CharField(max_length=500, blank=True, null=True)
    twitter_url = models.CharField(max_length=500, blank=True, null=True, help_text="Twitter / X profile URL")
    leetcode_url = models.CharField(max_length=500, blank=True, null=True, help_text="LeetCode profile URL")
    kaggle_url = models.CharField(max_length=500, blank=True, null=True, help_text="Kaggle profile URL")
    youtube_url = models.CharField(max_length=500, blank=True, null=True, help_text="YouTube channel URL")
    resume_url = models.CharField(max_length=500, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    footer_brand = models.CharField(max_length=100, blank=True, null=True, default="devil37", help_text="Brand name in the footer")
    footer_text = models.CharField(max_length=300, blank=True, null=True, default="Built with Precision & Performance.", help_text="Custom copyright/tagline text shown in the footer")

    def __str__(self):
        return f"{self.name} - {self.title}"

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("languages", "Languages"),
        ("backend", "Backend & Systems"),
        ("frontend", "Frontend"),
        ("ai_ml", "AI/ML & Data Science"),
        ("advanced_ai", "Advanced AI (Agents, RAGs, Workflows)"),
        ("tools", "Tools & DevOps"),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="backend")
    proficiency = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. Expert, Advanced")
    percentage = models.IntegerField(default=85, help_text="Skill proficiency percentage from 0 to 100")
    icon = models.CharField(max_length=50, blank=True, null=True, help_text="Lucide icon name or keyword")
    logo_url = models.CharField(max_length=500, blank=True, null=True, help_text="Custom logo image URL or vector graphic")
    color_theme = models.CharField(max_length=50, blank=True, null=True, help_text="Hex color theme e.g. #3776AB or #F62440")
    description = models.TextField(blank=True, null=True, help_text="Short hover tooltip description of the skill, shown on hover")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(help_text="Short card description")
    long_description = models.TextField(help_text="Detailed project description (Markdown supported)", blank=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    demo_url = models.URLField(blank=True, null=True)
    tech_stack = models.CharField(max_length=300, help_text="Comma separated tags e.g. Django,React,PyTorch")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order", "-id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Blog(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(help_text="Short reading preview")
    content = models.TextField(help_text="Markdown blog post content")
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)
    tags = models.CharField(max_length=200, help_text="Comma separated tags e.g. Deep Learning,RAG")
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Experience(models.Model):
    role = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True, help_text="Leave blank if currently working here")
    is_current = models.BooleanField(default=False)
    description = models.TextField(help_text="Role details, bullet points separated by newlines")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order", "-start_date"]

    def __str__(self):
        return f"{self.role} at {self.company}"

class TerminalCommand(models.Model):
    command = models.CharField(max_length=100, unique=True, help_text="e.g. neofetch, whoami, skills, help")
    response = models.TextField(help_text="Response output text returned when command is executed in terminal")
    description = models.CharField(max_length=200, blank=True, null=True, help_text="Short description of what command does")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order", "command"]

    def __str__(self):
        return f"${self.command}"

class ContactSubmission(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=250, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

class SocialLink(models.Model):
    ICON_CHOICES = [
        ("github", "GitHub"),
        ("linkedin", "LinkedIn"),
        ("twitter", "Twitter / X"),
        ("youtube", "YouTube"),
        ("leetcode", "LeetCode"),
        ("kaggle", "Kaggle"),
        ("discord", "Discord"),
        ("telegram", "Telegram"),
        ("mail", "Email"),
        ("instagram", "Instagram"),
        ("globe", "Website / Globe"),
        ("link", "Generic Link"),
    ]
    platform = models.CharField(max_length=50, choices=ICON_CHOICES, default="github")
    label = models.CharField(max_length=100, help_text="Display title e.g. GitHub / LinkedIn")
    url = models.CharField(max_length=500, help_text="Full destination URL or mailto link")
    icon = models.CharField(max_length=50, blank=True, null=True, help_text="Icon identifier (github, linkedin, twitter, etc.)")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.label} ({self.platform})"
