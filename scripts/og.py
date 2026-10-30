# Génère public/og.jpg (1200x630) : aperçu de partage WhatsApp / Facebook
import sys, math
from PIL import Image, ImageDraw, ImageFont
W,H = 1200,630; S = 2  # suréchantillonnage pour des courbes lisses
img = Image.new("RGB",(W*S,H*S),(251,248,241))
d = ImageDraw.Draw(img)
def bez(p0,p1,p2,p3,n=200):
    return [tuple((1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t**2*c+t**3*e for a,b,c,e in zip(p0,p1,p2,p3)) for t in [i/n for i in range(n+1)]]
def ribbon(y, col, w):
    pts = bez((-20,y),(350,y-120),(700,y+90),(1220,y-70))
    d.line([(x*S,yy*S) for x,yy in pts], fill=col, width=w*S, joint="curve")
ribbon(560,(1,47,109),14); ribbon(585,(224,2,123),9); ribbon(606,(201,162,39),5)
# bande supérieure
d.rectangle([0,0,W*S,10*S], fill=(1,47,109)); d.rectangle([0,10*S,W*S,14*S], fill=(201,162,39))
logo = Image.open("public/logo.png")
k = 860/logo.size[0]; logo = logo.resize((int(logo.size[0]*k*S), int(logo.size[1]*k*S)), Image.LANCZOS)
img.paste(logo, ((W*S-logo.size[0])//2, 70*S), logo)
f = ImageFont.truetype(sys.argv[1], 30*S)
txt = "AGENCE IMMOBILIÈRE À BINGERVILLE  ·  LOCATION  ·  VENTE  ·  GESTION"
tw = d.textlength(txt, font=f)
d.text(((W*S-tw)/2, 70*S+logo.size[1]+22*S), txt, font=f, fill=(1,47,109))
img = img.resize((W,H), Image.LANCZOS)
img.save("public/og.jpg", quality=86, optimize=True, progressive=True)
