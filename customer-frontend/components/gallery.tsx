"use client";

import NextImage from "next/image";
import { Tab } from "@headlessui/react";

import GalleryTab from "./gallery-tab";
import { useEffect, useState } from "react";

interface GalleryProps {
  images: any[];
  vrntSelected: string | undefined;
}

const Gallery: React.FC<GalleryProps> = ({ images = [], vrntSelected }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (vrntSelected) {
      const index = images.findIndex((image) => image?.vrntId === vrntSelected);
      if (index >= 0) setSelectedIndex(index);
    }
  }, [vrntSelected]);
  return (
    <Tab.Group
      as="div"
      className="flex flex-col-reverse"
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    >
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <GalleryTab key={image.id} image={image} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <img
                // fill
                src={image.url}
                alt="Image"
                className="object-contain object-center h-full w-full"
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
