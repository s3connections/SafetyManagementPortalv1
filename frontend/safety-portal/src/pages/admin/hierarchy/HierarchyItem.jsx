// src/pages/admin/hierarchy/HierarchyItem.jsx
import React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { Folder, FolderOpen } from '@mui/icons-material';

export default function HierarchyItem({ node }) {
  return (
    <TreeItem
      nodeId={node.id.toString()}
      label={node.name}
      collapseIcon={<FolderOpen />}
      expandIcon={<Folder />}
    >
      {node.children?.map((child) => (
        <HierarchyItem key={child.id} node={child} />
      ))}
    </TreeItem>
  );
}
