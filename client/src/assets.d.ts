declare module "*.jpg" {
  const image: import("next/image").StaticImageData;
  export default image;
}

declare module "*.png" {
  const image: import("next/image").StaticImageData;
  export default image;
}

declare module "*.svg" {
  const image: string;
  export default image;
}
