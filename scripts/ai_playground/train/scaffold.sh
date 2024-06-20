#!/bin/bash

# Create a directory for the project
mkdir my_ibrain_data_project
cd my_ibrain_data_project

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install required dependencies
pip install transformers torch

# Create directories for the code and data
mkdir code
mkdir data

# Create the Python training script
cat << EOF > code/train_model.py
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
import os

# Define the iBrain Data feature explanation
feature_explanation = '''
##Action:SectionOne##
Introduction to iBrain's Core Features
Begin by introducing iBrain as a revolutionary tool designed to empower teams and enhance workflows. Highlight the intuitive interaction with the AI assistant, emphasizing the natural, intention-driven discussions that do not require memorization of specific voice commands. Explain how iBrain understands the context of discussions and queries, providing relevant insights and taking appropriate actions based on the conversation's flow.

##Action:SectionTwo##
Advanced Capabilities for Global Teams and Data Analysis
Dive into the dynamic language adaptation feature, showcasing iBrain's ability to seamlessly adapt to over 90 languages, allowing users worldwide to engage in their preferred language without needing to adjust settings manually. Follow this by explaining the schema-aware data analysis capability, which leverages the database schema to generate insightful queries and extract meaningful information, all guided by the context of the ongoing discussion.

##Action:SectionThree##
Seamless Integration and Real-time Decision Making
Conclude with the effortless database integration and real-time insights delivery features. Detail how iBrain integrates with popular databases like MySQL, SQL, and PostgreSQL through natural language discussions, eliminating complex manual setup processes. Emphasize the benefit of receiving real-time data insights and analytics during discussions, which supports quick decision-making and problem-solving, streamlining business operations and enhancing productivity.
'''

# Generate synthetic dataset
dataset = []
for section in feature_explanation.split("##Action:"):
    if section.strip():
        section_name, section_text = section.split("##")
        dataset.append({"text": section_text.strip(), "label": section_name.strip()})

# Define model and tokenizer
model_name = "distilbert-base-uncased"
tokenizer = DistilBertTokenizer.from_pretrained(model_name)
model = DistilBertForSequenceClassification.from_pretrained(model_name, num_labels=3) # 3 sections

# Tokenize dataset
tokenized_dataset = tokenizer([example["text"] for example in dataset], truncation=True, padding=True)

# Define training arguments
training_args = TrainingArguments(
    per_device_train_batch_size=4,
    num_train_epochs=3,
    logging_dir='./logs',
    logging_steps=10,
)

# Define Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

# Train the model
trainer.train()

# Save the model in Transformer.js format
os.makedirs("transformerjs_model", exist_ok=True)
model.save_pretrained("transformerjs_model")
tokenizer.save_pretrained("transformerjs_model")
EOF

# Make the Python script executable
chmod +x code/train_model.py

# Deactivate the virtual environment
deactivate

echo "Setup completed. You can activate the virtual environment and run the training script using:"
echo "source venv/bin/activate"
echo "python code/train_model.py"
