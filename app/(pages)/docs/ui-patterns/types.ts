import React from 'react';

export interface UIComponent {
  id: string;
  title: string;
  description: string;
  category: string;
  content: React.ReactNode;
  usage: string;
}