"use client";

import { menuService } from '@/modules/menu/menu.service';
import MenuItem from './MenuItem';

export default function MenuSidebar() {
  const menu = menuService.getMenu();

  return (
    <div style={{
      width: '220px',
      background: '#1a1a1a',
      color: 'white',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    }}>
      {menu.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
