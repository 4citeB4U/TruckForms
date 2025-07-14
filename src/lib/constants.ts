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
  ListOrdered,
  FileWarning,
  Fuel,
  Wrench,
  ShieldCheck,
  PackageX,
  AlertTriangle,
  HeartPulse,
  MessageSquare,
  Map,
  Clock,
  Users,
  Contact,
  FileCheck2,
  Timer,
  ClipboardCheck,
  FileEdit,
  DollarSign,
  Scroll,
  FileBadge,
  BadgePercent,
  Receipt,
  GraduationCap,
  ShieldAlert,
  Shield,
  FileQuestion,
  UserCog,
  FileHeart,
  FileClock,
  Car,
  Bell,
  MessageCircle,
  Phone,
  ListChecks,
  FileUp,
  Paperclip,
  Pencil,
  BookCopy,
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
        href: '/forms/drivers-daily-log',
        icon: ClipboardList,
        role: 'Driver',
        description: 'Track Hours of Service for compliance.',
      },
      {
        title: 'Pre/Post-Trip Inspection (DVIR)',
        href: '#',
        icon: Truck,
        role: 'Driver',
        description: 'Vehicle inspection before and after trips.',
      },
      {
        title: 'Accident/Incident Report',
        href: '#',
        icon: FileWarning,
        role: 'Driver',
        description: 'Report any on-road incidents or accidents.',
      },
      {
        title: 'Fuel Receipt Submission',
        href: '#',
        icon: Fuel,
        role: 'Driver',
        description: 'Submit fuel receipts for IFTA tax reporting.',
      },
      {
        title: 'Roadside Inspection Report',
        href: '#',
        icon: ShieldCheck,
        role: 'Driver',
        description: 'Document details of a roadside inspection.',
      },
      {
        title: 'Cargo Damage/Loss Report',
        href: '#',
        icon: PackageX,
        role: 'Driver',
        description: 'Report any damage or loss of cargo.',
      },
      {
        title: 'Medical Certificate Submission',
        href: '#',
        icon: HeartPulse,
        role: 'Driver',
        description: 'Submit and track medical certification.',
      },
      {
        title: 'Violation/Warning Notice',
        href: '#',
        icon: ShieldAlert,
        role: 'Driver',
        description: 'Acknowledge receipt of a violation or warning.'
      }
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
        icon: Map,
        role: 'Dispatcher',
        description: 'Provide route details and special instructions.',
      },
      {
        title: 'Dispatch Communication Log',
        href: '#',
        icon: MessageSquare,
        role: 'Dispatcher',
        description: 'Track communications with drivers.',
      },
      {
        title: 'Exception/Delay Report',
        href: '#',
        icon: Clock,
        role: 'Dispatcher',
        description: 'Report delays or exceptions during transit.',
      },
      {
        title: 'Driver Availability Board',
        href: '#',
        icon: Users,
        role: 'Dispatcher',
        description: 'Track driver availability and status.',
      },
      {
        title: 'Customer Contact Sheet',
        href: '#',
        icon: Contact,
        description: 'Log customer contact information and notes.',
        role: 'Dispatcher'
      },
      {
        title: 'Load Confirmation Sheet',
        href: '#',
        icon: FileCheck2,
        role: 'Dispatcher',
        description: 'Confirm load details with shippers/brokers.',
      },
      {
        title: 'Detention/Wait Time Report',
        href: '#',
        icon: Timer,
        description: 'Track and report waiting times at facilities.',
        role: 'Dispatcher'
      },
      {
        title: 'Driver Handover Checklist',
        href: '#',
        icon: ClipboardCheck,
        description: 'Ensure smooth handover between drivers.',
        role: 'Dispatcher'
      }
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
       {
        title: 'Incident/Accident Review',
        href: '#',
        icon: FileQuestion,
        description: 'Internal review of reported incidents.',
        role: 'Driver Manager'
      },
      {
        title: 'Disciplinary Action Log',
        href: '#',
        icon: FileEdit,
        role: 'Driver Manager',
        description: 'Document coaching or corrective actions.',
      },
      {
        title: 'Driver File Update Form',
        href: '#',
        icon: UserCog,
        description: 'Log updates to a driver\'s file.',
        role: 'Driver Manager'
      },
      {
        title: 'Safety Meeting Attendance',
        href: '#',
        icon: ClipboardCheck,
        role: 'Driver Manager',
        description: 'Record attendance for safety meetings.',
      },
      {
        title: 'Driver Complaint/Feedback',
        href: '#',
        icon: MessageCircle,
        description: 'Log and address driver feedback.',
        role: 'Driver Manager'
      },
      {
        title: 'Injury/Illness Report',
        href: '#',
        icon: FileHeart,
        description: 'Official report for any work-related injuries.',
        role: 'Driver Manager'
      }
    ],
  },
  {
    title: 'Owner-Operator',
    items: [
      {
        title: 'Maintenance & Repair Log',
        href: '#',
        icon: Wrench,
        role: 'Owner-Operator',
        description: 'Track all vehicle maintenance and repairs.',
      },
      {
        title: 'Expense Report',
        href: '#',
        icon: DollarSign,
        role: 'Owner-Operator',
        description: 'Record operational expenses.',
      },
      {
        title: 'Income/Settlement Statement',
        href: '#',
        icon: Receipt,
        role: 'Owner-Operator',
        description: 'Summarize loads and payments received.',
      },
      {
        title: 'Insurance Certificate Submission',
        href: '#',
        icon: FileUp,
        description: 'Submit proof of insurance.',
        role: 'Owner-Operator'
      },
      {
        title: 'IFTA Fuel Tax Report',
        href: '#',
        icon: BadgePercent,
        role: 'Owner-Operator',
        description: 'File quarterly fuel tax reports.',
      },
       {
        title: 'Lease Agreement Form',
        href: '#',
        icon: FileBadge,
        role: 'Owner-Operator',
        description: 'Manage lease agreements.',
      },
      {
        title: 'Tax Forms (1099/W-9)',
        href: '#',
        icon: BookCopy,
        description: 'Submit and manage tax documentation.',
        role: 'Owner-Operator'
      },
      {
        title: 'Operating Authority/MC Number',
        href: '#',
        icon: FileBadge,
        description: 'Application or record of operating authority.',
        role: 'Owner-Operator'
      },
      {
        title: 'Equipment Ownership/Title',
        href: '#',
        icon: Car,
        description: 'Documentation for equipment titles.',
        role: 'Owner-Operator'
      },
      {
        title: 'Business License/Permits',
        href: '#',
        icon: Scroll,
        description: 'Manage business licenses and permits.',
        role: 'Owner-Operator'
      }
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
       {
        title: 'Skills Assessment Checklist',
        href: '#',
        icon: ClipboardCheck,
        role: 'Teacher/Trainer',
        description: 'Document completion of required skills.',
      },
       {
        title: 'Training Evaluation Form',
        href: '#',
        icon: GraduationCap,
        role: 'Teacher/Trainer',
        description: 'Assess trainee comprehension and performance.',
      },
      {
        title: 'Certification Completion Report',
        href: '#',
        icon: FileCheck2,
        description: 'Confirm trainees have met certification requirements.',
        role: 'Teacher/Trainer'
      },
      {
        title: 'Trainee Feedback/Survey',
        href: '#',
        icon: MessageSquare,
        description: 'Collect feedback from trainees.',
        role: 'Teacher/Trainer'
      },
      {
        title: 'Incident/Observation Report',
        href: '#',
        icon: Pencil,
        description: 'Document issues or events during training.',
        role: 'Teacher/Trainer'
      },
       {
        title: 'Lesson Plan Submission',
        href: '#',
        icon: Paperclip,
        description: 'Submit and track lesson plans.',
        role: 'Teacher/Trainer'
      }
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
        href: '/forms/drivers-daily-log',
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
