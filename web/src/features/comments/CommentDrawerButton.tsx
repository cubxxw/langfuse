import Header from "@/src/components/layouts/header";
import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { CommentCountIcon } from "@/src/features/comments/CommentCountIcon";
import { CommentList } from "@/src/features/comments/CommentList";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { type CommentObjectType } from "@langfuse/shared";
import { MessageCircleIcon, MessageCircleOff } from "lucide-react";
import React from "react";

export function CommentDrawerButton({
  projectId,
  objectId,
  objectType,
  count,
  size = "icon",
}: {
  projectId: string;
  objectId: string;
  objectType: CommentObjectType;
  count?: number;
  size?: "icon" | "sm";
}) {
  const hasReadAccess = useHasProjectAccess({
    projectId,
    scope: "comments:read",
  });
  const hasWriteAccess = useHasProjectAccess({
    projectId,
    scope: "comments:CUD",
  });

  if (!hasReadAccess || (!hasWriteAccess && !count))
    return (
      <Button type="button" variant="secondary" disabled>
        <MessageCircleOff className="h-4 w-4 text-muted-foreground" />
      </Button>
    );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button type="button" variant="secondary" size={size}>
          {!!count ? (
            <CommentCountIcon count={count} />
          ) : (
            <MessageCircleIcon className="h-5 w-5" />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-1/3" overlayClassName="bg-primary/10">
        <div className="mx-auto w-full overflow-y-auto md:max-h-full">
          <DrawerHeader className="sticky top-0 z-10 rounded-sm bg-background">
            <Header title="Comments" level="h3"></Header>
          </DrawerHeader>
          <div data-vaul-no-drag className="px-4">
            <CommentList
              projectId={projectId}
              objectId={objectId}
              objectType={objectType}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
