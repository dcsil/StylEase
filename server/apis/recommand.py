# Combination ["Shirt", "Ankle boot", "Trouser", "Coat"] # Style: Business
# Combination ["T-shirt/top", "Sneaker", "Trouser", "Coat", "Bag"] # Style: Casual
from apis.finder import *

def get_score(item, color, style, type, itemid):
    item_dict = {}
    item_score = 0
    if item['type'] in type:
        if 'color' in item and item['color'] in color:
            item_score += 1
        if "Style" in item and item["Style"] in style:
            item_score += 1
        item_dict['score'] = item_score
        item_dict['item'] = itemid
        item_dict['type'] = item['type']
        item_dict['user'] = item['user']
    return item_dict

def item_finder(client, type, color, from_market, style, userid):
    type_lst = type
    target_user = find_by_id(client, 'users', userid)
    target_wardrobe_id = target_user['wardrobe']
    target_wardrobe = find_by_id(client, 'wardrobes', target_wardrobe_id)
    item_ids = target_wardrobe['items']
    item_lst = []
    # Loop over items in database client.items.find()
    if True in from_market:
        market_items = client.db.items.find({ "user": "" })
        for item in market_items:
            item_dict = get_score(item, color, style, type, str(item['_id']))
            if item_dict:
                item_lst.append(item_dict)

    for item in item_ids:
        # item_dict = {}
        # item_score = 0
        target_item = find_by_id(client, 'items', item)
        # if target_item['type'] in type:
        #     # Check if 'color' is a key of the item
        #     # if target_item['market'] in from_market:
        #     if 'color' in target_item and target_item['color'] in color:
        #         item_score += 1
        #     if "Style" in target_item and target_item["Style"] in style:
        #         item_score += 1
        #     item_dict['score'] = item_score
        #     item_dict['item'] = item
        #     item_dict['type'] = target_item['type']
        #     item_dict['user'] = target_item['user']
        #     item_lst.append(item_dict)
        item_dict = get_score(target_item, color, style, type, item)
        if item_dict:
            item_lst.append(item_dict)

    # Rank by item_score
    item_lst.sort(key=lambda x: x['score'], reverse=True)
    # Pick the item with the highest score in each type
    picked_item_lst = []
    for item in item_lst:
        if item['type'] in type_lst:
            item_dict = {'_id': item['item'], 'user': item['user']}
            picked_item_lst.append(item_dict)
            type_lst.remove(item['type'])
            if not type_lst:
                break
    print(picked_item_lst)
    return picked_item_lst


def recommand_outfit(client, selected_items, style, from_market, userid):
    if style == 'Business':
        combination = ["Shirt", "Ankle boot", "Trouser", "Coat"]
    elif style == 'Casual':
        combination = ["T - shirt / top", "Sneaker", "Trouser", "Coat", "Bag", "Pullover"]
    else:
        combination = ["T - shirt / top", "Ankle boot", "Trouser", "Coat", "Bag"]
    selected_item_lst = get_items(client, selected_items)
    selected_item_types = [item['type'] for item in selected_item_lst]
    # Take the missing types from the combination
    missing_types = [type for type in combination if type not in selected_item_types]
    selected_item_colors = [item['color'] for item in selected_item_lst]
    if 'Black' in selected_item_colors:
        selected_item_colors.append('White')
        selected_item_colors.append('Grey')
        selected_item_colors.append('Brown')
    if 'White' in selected_item_colors:
        selected_item_colors.append('Black')
        selected_item_colors.append('Grey')
        selected_item_colors.append('Brown')
        selected_item_colors.append('Green')
    if 'Blue' in selected_item_colors:
        selected_item_colors.append('White')
        selected_item_colors.append('Black')

    # Remove duplicate colors
    selected_item_colors = list(set(selected_item_colors))
    from_market_lst = [True, False] if from_market else [False]
    style_lst = [style, '']
    # Find the missing items
    missing_items = item_finder(client, missing_types, selected_item_colors, from_market_lst, style_lst, userid)
    # Combine the selected items and the missing items
    for item in selected_items:
        item_dict = {'_id': item, 'user': userid}
        missing_items.append(item_dict)

    return missing_items




