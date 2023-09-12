from base64 import urlsafe_b64encode as btoa
from csv import DictReader
from pathlib import Path
import json
import re
import sys
import unicodedata

import requests


def main():
    ifname, odname = "", ""
    try:
        ifname, odname = sys.argv[1:3]
    except ValueError:
        pass
    if not ifname or not odname:
        sys.exit("error: must specify input file name and output directory name")
    process(ifname, odname)


def process(ifname, odname):
    print(f"input: {ifname!r}\noutput: {odname!r}")
    with open(ifname) as f:
        rows = list(DictReader(f))

    canonical_rows = [
        "title",
        "linktitle",
        # "prefix",
        "first",
        # "middle",
        "last",
        # "suffix",
        "organization",
        # "diversity",
        "pronunciation",
        "contact",
        "honorific",
        "pronoun",
        "role",
        "expertise",
        "languages",
        # "keywords",
        "email",
        "images",
        "website",
        # "facebook",
        # "twitter",
        # "instagram",
        "location",
        "linkedin",
        "location",
        "phone",
        "bio",
        "layout",
    ]

    newrows = []
    for row in rows:
        for field in row:
            row[field] = row[field].strip()

        fullname = soft_join(row, "prefix", "first", "middle", "last")
        if row["suffix"]:
          fullname = ", ".join([fullname, row["suffix"]])
        row["title"] = fullname
        row["linktitle"] = soft_join(row, "first", "last")
        row["expertise"] = get_expertise(row["expertise"])
        row["location"] = trim_all(row["locations"].split(","))
        row["email"] = btoa(row["email"].encode("utf8")).decode("ascii")
        row["layout"] = "person"
        row["images"] = get_images(row)
        newrows.append({key: row.get(key, "") for key in canonical_rows})

    seen = set()
    for row in newrows:
        fname = slugify(row["linktitle"]) + ".md"
        if fname in seen:
            print(f"warning: duplicate {fname}")
            fname = f"{row['linktitle']}.{len(seen)}.md"
        else:
            seen.add(fname)
        with open(Path(odname, fname), "w") as f:
            json.dump(row, f, indent=2)


def soft_join(row, *fields):
    s = " ".join(row[field] for field in fields)
    return s.replace("  ", " ").strip()


def trim_all(ss):
    r = []
    for s in ss:
        s = s.strip()
        if s:
            r.append(s)
    return r

def get_images(row):
    skip_download = True

    headshot = row["headshot"].strip()
    if not headshot:
      return []

    if headshot.startswith("https://drive.google.com/file/d/"):
      gid = headshot.removeprefix("https://drive.google.com/file/d/")
      gid, _, _ = gid.partition("/")
    elif headshot.startswith("https://drive.google.com/open?id="):
      gid = headshot.removeprefix("https://drive.google.com/open?id=")
    else:
      print(f"bad headshot {headshot}")
      return []
    url = f"https://drive.google.com/uc?export=download&id={gid}"
    name =  slugify(row["linktitle"])
    image = Path("static", "img", "uploads", f"{name}.jpeg")
    if image.exists() or skip_download:
      print(f"have {url}...")
      return [f"/img/uploads/{name}.jpeg"]
    try:
      print(f"getting {url}...")
      rsp = requests.get(url)
      rsp.raise_for_status()
    except Exception as e:
      print(f"bad {e}")
      return []
    with open(image, "wb") as f:
        f.write(rsp.content)
    return [f"/img/uploads/{name}.jpeg"]

def get_expertise(s):
    s = s.replace("GOVERNMENT (FEDERAL, STATE, LOCAL)", "Government")
    s = s.title()
    s = s.replace("Lgbtq", "LGBTQ")
    ss = trim_all(s.split(","))
    return ss

def slugify(s):
  return re.sub(r'\W+', '-', remove_accents(s).lower())

def remove_accents(input_str):
     nfkd_form = unicodedata.normalize('NFKD', input_str)
     return "".join(c for c in nfkd_form if not unicodedata.combining(c))

if __name__ == "__main__":
    main()
