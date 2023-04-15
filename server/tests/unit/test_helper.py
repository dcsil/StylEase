from database import client as cl
from apis.finder import *
from apis.recommand import *

# Test Recommand
# Test get item score
def test_get_score():
    color = ["Black", "White", "Blue"]
    style = ["Casual", "Business"]
    type = ["T - shirt / top", "Sneaker", "Trouser", "Coat", "Bag", "Pullover"]
    itemid1 = "1"
    item1 = {
        "type": "T - shirt / top",
        "color": "Black",
        "style": "Business Casual",
        "user": "1"
    }
    itemid2 = "2"
    item2 = {
        "type": "Sneaker",
        "color": "Pink",
        "user": ""
    }

    item_score_1 = get_score(item1, color, style, type, itemid1)
    item_score_2 = get_score(item2, color, style, type, itemid2)

    assert item_score_1['score'] == 1
    assert item_score_1['item'] == itemid1
    assert item_score_1['type'] == "T - shirt / top"
    assert item_score_1['user'] == "1"

    assert item_score_2['score'] == 0
    assert item_score_2['item'] == itemid2
    assert item_score_2['type'] == "Sneaker"
    assert item_score_2['user'] == ""


