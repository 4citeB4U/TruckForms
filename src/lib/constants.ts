import {
  User,
  Truck,
  ClipboardList,
  UserCheck,
  Briefcase,
  BookUser,
  FileText,
  Ship,
  FilePlus2,
  ListOrdered
} from 'lucide-react';
import type { NavItemGroup, NavItem } from '@/lib/types';

export const FORM_CATEGORIES: NavItemGroup[] = [
  {
    title: 'Driver',
    items: [
      {
        title: 'Bill of Lading (BOL)',
        href: '/forms/bill-of-lading',
        icon: FileText,
        role: 'Driver',
        description: 'Official record of freight being transported.',
      },
      {
        title: 'Driver’s Daily Log (HOS)',
        href: '#',
        icon: ClipboardList,
        role: 'Driver',
        description: 'Track Hours of Service for compliance.',
      },
      {
        title: 'Pre/Post-Trip Inspection',
        href: '#',
        icon: Truck,
        role: 'Driver',
        description: 'Vehicle inspection before and after trips.',
      },
    ],
  },
  {
    title: 'Dispatcher',
    items: [
      {
        title: 'Load Assignment Sheet',
        href: '#',
        icon: ListOrdered,
        role: 'Dispatcher',
        description: 'Assign loads with pickup/delivery details.',
      },
       {
        title: 'Route & Trip Sheet',
        href: '#',
        icon: Ship,
        role: 'Dispatcher',
        description: 'Provide route details and special instructions.',
      },
    ],
  },
  {
    title: 'Driver Manager',
    items: [
      {
        title: 'Driver Qualification File',
        href: '#',
        icon: UserCheck,
        role: 'Driver Manager',
        description: 'Checklist for required driver documents.',
      },
      {
        title: 'Driver Performance Evaluation',
        href: '#',
        icon: User,
        role: 'Driver Manager',
        description: 'Regular assessment of driver performance.',
      },
    ],
  },
  {
    title: 'Owner-Operator',
    items: [
      {
        title: 'Maintenance & Repair Log',
        href: '#',
        icon: Briefcase,
        role: 'Owner-Operator',
        description: 'Track all vehicle maintenance and repairs.',
      },
    ],
  },
  {
    title: 'Teacher/Trainer',
    items: [
      {
        title: 'Training Attendance Sheet',
        href: '#',
        icon: BookUser,
        role: 'Teacher/Trainer',
        description: 'Record attendance for training sessions.',
      },
    ],
  },
];


export const ALL_FORMS: NavItem[] = FORM_CATEGORIES.flatMap(category => category.items);

export const QUICK_ACTIONS: NavItem[] = [
    {
        title: 'New Bill of Lading',
        href: '/forms/bill-of-lading',
        icon: FilePlus2,
        description: 'Start a new shipment record.'
    },
    {
        title: 'New HOS Log',
        href: '#',
        icon: FilePlus2,
        description: 'Log your daily hours of service.'
    },
    {
        title: 'New Inspection Report',
        href: '#',
        icon: FilePlus2,
        description: 'Complete a pre or post-trip inspection.'
    }
]
