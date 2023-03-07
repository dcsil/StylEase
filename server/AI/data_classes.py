# This file is used for handel data in the database and send to the AI for prediction
from transformers import TrainingArguments, Trainer
import os
import torch
from torch.utils.data import Dataset
#
class WardrobeDataset(Dataset):
    def __init__(self, weather_lst, occasion_lst, color_lst, budget_lst, style_lst, tokenizer):
        self.input_ids = []
        self.attention_mask = []
        self.labels = []
        # self.map_label = label_maps

        for weather, occasion, color, budget, style in zip(weather_lst, occasion_lst, color_lst, budget_lst, style_lst):
            # prep_txt = f'<startoftext>Content: {txt}\nLabel: {self.map_label[label]}<endoftext>'

            prep_txt = f"Today’s weather is {weather}. I’m having a {occasion}. I prefer my clothing " \
                        f"color in {color}. Please give my an outfit in {style}. " \
                       f"Please suggest clothes that in budget {budget} if not selected " \
                        f"from my wardrobe"

            encodings_dict = tokenizer(prep_txt, truncation=True, padding="max_length")

            self.input_ids.append(torch.tensor(encodings_dict['input_ids']))
            self.attention_mask.append(torch.tensor(encodings_dict['attention_mask']))

    def __len__(self):
        return len(self.input_ids)

    def __getitem__(self, idx):
        dic = {
            'input_ids': self.input_ids[idx],
            'attention_mask': self.attention_mask[idx]
        }
        # return self.input_ids[idx], self.attention_mask[idx], self.labels[idx]
        return dic