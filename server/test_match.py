from app import create_app

app = create_app()
app.app_context().push()

from models import Product

products = Product.query.filter_by(is_on_sale=True).all()
print(f"Total products: {len(products)}")
print("Products:")
for p in products:
    print(f"  - {p.name}")

PRODUCT_TAG_MAP = {
    "清爽": ["青柠冰美式", "西柚冷萃气泡饮", "冰淇淋美式"],
    "提神": ["蓝色深海美式", "青柠冰美式", "抹茶美式", "冰淇淋美式"],
}

user_text = "清爽"

matched = {}
user_text_lower = user_text.lower()

for tag_kw, product_names in PRODUCT_TAG_MAP.items():
    if tag_kw.lower() in user_text_lower or user_text_lower in tag_kw.lower():
        print(f"Keyword '{tag_kw}' matched!")
        print(f"  Looking for products: {product_names}")
        for product in products:
            if product.name in product_names:
                print(f"    Found: {product.name}")
                matched[product.id] = product

print(f"\nMatched products: {len(matched)}")
for pid, p in matched.items():
    print(f"  {p.name}")
