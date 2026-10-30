# Génère public/logo.png (détouré), public/logo-white.png, app/icon.png, app/apple-icon.png à partir de logo.jpg
import sys
from PIL import Image, ImageFilter
src = Image.open(sys.argv[1]).convert("RGB")
W,H = src.size
px = src.load()
out = Image.new("RGBA", (W,H))
op = out.load()
for y in range(H):
    for x in range(W):
        r,g,b = px[x,y]
        # distance au blanc -> alpha ; on "dé-mélange" le blanc pour des bords propres
        a = 255 - min(r,g,b)
        a = max(0, min(255, int((a-12)*255/(255-40)))) if a>12 else 0
        if a == 0:
            op[x,y] = (0,0,0,0); continue
        af = a/255
        c = tuple(max(0,min(255,int((v-255*(1-af))/af))) for v in (r,g,b))
        op[x,y] = c+(a,)
bbox = out.getchannel("A").point(lambda v: 255 if v>60 else 0).getbbox()
logo = out.crop((bbox[0]-6,bbox[1]-6,bbox[2]+6,bbox[3]+6))
logo.save("public/logo.png", optimize=True)
w,h = logo.size
# versions allégées pour l'en-tête / pied de page (sans slogan), 2x pour écrans rétina
def mark(img, name):
    a = img.getchannel("A"); hh = img.size[1]
    # la ligne rose du slogan se trouve vers 78 % de la hauteur : on coupe juste au-dessus
    cut = int(hh*0.765)
    m = img.crop((0,0,img.size[0],cut)); m = m.crop(m.getchannel("A").point(lambda v:255 if v>60 else 0).getbbox())
    k = 400/m.size[0]; m = m.resize((400, round(m.size[1]*k)), Image.LANCZOS)
    m.save(f"public/{name}.png", optimize=True); m.save(f"public/{name}.webp", quality=90, method=6)
    return m
mark(logo, "logo-mark")
# version blanche (pour fonds marine) : bleu -> blanc, rose garde sa couleur
wl = logo.copy(); p = wl.load()
for y in range(wl.size[1]):
    for x in range(wl.size[0]):
        r,g,b,a = p[x,y]
        if a and not (r>150 and g<120):  # pas rose
            p[x,y] = (255,255,255,a)
wl.save("public/logo-white.png", optimize=True)
mark(wl, "logo-mark-white")
logo.save("public/logo.webp", quality=90, method=6)
# maison rose : pixels roses dans la zone du "A"
house = Image.new("RGBA",(W,H)); hp = house.load()
for y in range(330,570):
    for x in range(400,630):
        r,g,b = px[x,y]
        if r>170 and g<140 and b>60 and r-g>80:
            a = min(255,int((r-g-60)*255/120)); hp[x,y]=(0xE0,0x02,0x7B,a)
hb = house.getbbox(); house = house.crop(hb)
def square(img, size, bg, pad):
    canvas = Image.new("RGBA",(size,size),bg)
    s = int(size*(1-2*pad)); im = img.copy(); k = s/max(im.size); im = im.resize((round(im.size[0]*k), round(im.size[1]*k)), Image.LANCZOS)
    canvas.alpha_composite(im, ((size-im.size[0])//2,(size-im.size[1])//2)); return canvas
square(house,256,(0,0,0,0),0.04).save("app/icon.png")
square(house,180,(255,255,255,255),0.14).convert("RGB").save("app/apple-icon.png")
square(house,48,(255,255,255,255),0.06).save("app/favicon.ico", sizes=[(48,48),(32,32),(16,16)])
print(logo.size, hb)
