import React from 'react';
import MuiTreeItem from 'components/dragdrop/TreeItem';
import { Folder, FolderOpen } from '@mui/icons-material';

export default function HierarchyItem({ node }) {
  return (
    <MuiTreeItem
      nodeId={node.id.toString()}
      label={node.name}
      collapseIcon={<FolderOpen />}
      expandIcon={<Folder />}
    >
      {node.children?.map((c) => <HierarchyItem key={c.id} node={c} />)}
    </MuiTreeItem>
  );
}
