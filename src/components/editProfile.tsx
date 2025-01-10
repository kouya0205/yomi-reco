'use client';

import Avatar from '@/components/avatar';
import ProfileForm from '@/components/profileForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { updateImg } from '@/hooks/useActions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ImageListType } from 'react-images-uploading';

export default function EditProfile({ userData }: { userData: any }) {
  const [open, setOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState<ImageListType>([
    {
      dataURL: userData.avatar_url || '',
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const updateImage = (imageList: ImageListType) => {
    let base64Image: string | undefined;

    startTransition(async () => {
      try {
        if (imageList[0].dataURL && imageList[0].dataURL.startsWith('data:image')) {
          const image = imageList[0];

          if (image.dataURL) {
            base64Image = image.dataURL;
          }
        }

        const res = await updateImg({
          base64Image,
        });

        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">プロフィール編集</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>プロフィール編集</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <Avatar
            uid={userData.id ?? null}
            initialUrl={imageUpload}
            onUpload={(imageList: ImageListType) => {
              setImageUpload(imageList);
              updateImage(imageList);
            }}
          />
          <ProfileForm userData={userData} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">プロフィール編集</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>プロフィール編集</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <Avatar
          uid={userData.id ?? null}
          initialUrl={imageUpload}
          onUpload={(imageList: ImageListType) => {
            setImageUpload(imageList);
            updateImage(imageList);
          }}
        />
        <ProfileForm userData={userData} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
