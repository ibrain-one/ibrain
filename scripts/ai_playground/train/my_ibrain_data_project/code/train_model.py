import torch
from transformers import AutoTokenizer, Trainer, TrainingArguments, DistilBertForSequenceClassification
import os

# Define model


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
sections = feature_explanation.strip().split("##Action:")[1:]  # Split once at the start
for section in sections:
    section_name, section_text = section.split("\n", 1)  # Split at the first newline
    dataset.append(section_text.strip())

print("dataset = ", dataset)

# Define model and tokenizer
model_name = "distilbert-base-uncased"  # You can choose any DistilBERT or TinyBERT variant
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = DistilBertForSequenceClassification.from_pretrained(model_name, num_labels=len(dataset))


# Tokenize dataset and prepare inputs
tokenized_dataset = tokenizer(
    "helllo",
    padding=True,
    # truncation=True,
)

# Add labels to the tokenized dataset
# tokenized_dataset["labels"] = [int(example["label"].split("##")[-1]) if example["label"].split("##")[-1] else None for example in dataset]

print("tokenized_dataset = ", tokenized_dataset)

# Define training arguments
training_args = TrainingArguments(
    per_device_train_batch_size=4,
    num_train_epochs=3,
    logging_dir='./logs',
    logging_steps=10,
    output_dir="."
)

# Define Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset
)

# Train the model
trainer.train()

# Save the model in Transformer.js format
os.makedirs("transformerjs_model", exist_ok=True)
model.save_pretrained("transformerjs_model")
tokenizer.save_pretrained("transformerjs_model")
