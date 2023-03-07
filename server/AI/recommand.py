from data_classes import WardrobeDataset
from datasets import load_dataset, load_metric
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
import numpy as np
from transformers import TrainingArguments, Trainer
import os
import torch
from torch.utils.data import Dataset

def recommand_outfit(weather_lst, occasion_lst, color_lst, budget_lst, style_lst):
    '''
    :param weather_lst:
    :param occasion_lst:
    :param color_lst:
    :param budget_lst:
    :param style_lst:
    :return:
    This function is used to recommand outfit based on the user's preferences
    '''
    # Load the tokenizer
    tokenizer = AutoTokenizer.from_pretrained("gpt2-medium")
    tokenizer.pad_token = tokenizer.eos_token
    data = WardrobeDataset(weather_lst, occasion_lst, color_lst, budget_lst, style_lst, tokenizer)
    # Load the model
    model = AutoModelForSequenceClassification.from_pretrained("./outfit_recommand_model")
    trainer = Trainer(model=model)
    os.environ["WANDB_DISABLED"] = "true"
    predictions = trainer.predict(data)

    return np.argmax(predictions.predictions, axis=-1)