from app import create_app

app = create_app()
app.app_context().push()

from routes.ai import _match_by_tag_keywords, _match_by_product_name, _match_by_category
from models import Product

products = Product.query.filter_by(is_on_sale=True).all()
user_text = "清爽"

print(f"Testing with: '{user_text}'")
print(f"Total products: {len(products)}")

name_matched = _match_by_product_name(user_text, products)
print(f"\n_match_by_product_name: {len(name_matched)} results")
for item in name_matched:
    print(f"  - {item['product'].name} (score: {item['score']})")

cat_matched = _match_by_category(user_text, products)
print(f"\n_match_by_category: {len(cat_matched)} results")
for item in cat_matched:
    print(f"  - {item['product'].name} (score: {item['score']})")

tag_matched = _match_by_tag_keywords(user_text, products)
print(f"\n_match_by_tag_keywords: {len(tag_matched)} results")
for item in tag_matched:
    print(f"  - {item['product'].name} (score: {item['score']}, tags: {item['matched_tags']})")

all_matched = []
all_matched.extend(name_matched)
all_matched.extend(cat_matched)
all_matched.extend(tag_matched)

print(f"\nTotal matched: {len(all_matched)}")
