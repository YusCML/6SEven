# Hotspot cover photos

Drop a photo in here and wire it up in `src/features/hotspot/data.ts`.

## Places still missing a photo

| id | Place | Suggested filename |
| --- | --- | --- |
| `esplanade` | Iloilo River Esplanade, Diversion Road | `esplanade.jpg` |
| `tagbak` | Tagbak Terminal, Jaro | `tagbak.jpg` |
| `la-paz` | La Paz Public Market | `la-paz.jpg` |
| `molo` | Molo Plaza, Molo District | `molo.jpg` |
| `muelle` | Muelle Loney Street, City Proper | `muelle.jpg` |
| `ungka` | Ungka Flyover Stop, Pavia boundary | `ungka.jpg` |

## Wiring one up

Add the import at the top of `data.ts`:

```ts
import molo from '@/assets/hotspot/molo.jpg';
```

Then set `photo` on that entry:

```ts
{
  id: 'molo',
  title: 'Molo Plaza',
  photo: molo,
  ...
}
```

Anything left without a `photo` keeps its generated cover, so partial coverage is fine.

## Using a URL instead

`photo` also accepts a string. Only these hosts are allowed by
`next.config.ts` — add others to `images.remotePatterns` first:

- `upload.wikimedia.org`
- `images.unsplash.com`

```ts
photo: 'https://upload.wikimedia.org/wikipedia/commons/…/molo-plaza.jpg',
```

Local files are preferred: they get build-time optimisation and a blur
placeholder, and they don't break when the remote host moves the file.

## Licensing

Check the licence before committing a photo. Wikimedia Commons images are
usually free to reuse but most require attribution — record the source and
licence alongside the file if so.
