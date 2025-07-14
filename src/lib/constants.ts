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
        href: '/forms/pre-post-trip-inspection',
        icon: Truck,
        role: 'Driver',
        description: 'Vehicle inspection before and after trips.',
      },
      {
        title: 'Accident/Incident Report',
        href: '/forms/accident-incident-report',
        icon: FileWarning,
        role: 'Driver',
        description: 'Report any on-road incidents or accidents.',
      },
      {
        title: 'Fuel Receipt Submission',
        href: '/forms/fuel-receipt-submission',
        icon: Fuel,
        role: 'Driver',
        description: 'Submit fuel receipts for IFTA tax reporting.',
      },
      {
        title: 'Roadside Inspection Report',
        href: '/forms/roadside-inspection-report',
        icon: ShieldCheck,
        role: 'Driver',
        description: 'Document details of a roadside inspection.',
      },
      {
        title: 'Cargo Damage/Loss Report',
        href: '/forms/cargo-damage-loss-report',
        icon: PackageX,
        role: 'Driver',
        description: 'Report any damage or loss of cargo.',
      },
      {
        title: 'Medical Certificate Submission',
        href: '/forms/medical-certificate-submission',
        icon: HeartPulse,
        role: 'Driver',
        description: 'Submit and track medical certification.',
      },
      {
        title: 'Violation/Warning Notice',
        href: '/forms/violation-warning-notice',
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
        href: '/forms/load-assignment-sheet',
        icon: ListOrdered,
        role: 'Dispatcher',
        description: 'Assign loads with pickup/delivery details.',
      },
       {
        title: 'Route & Trip Sheet',
        href: '/forms/route-trip-sheet',
        icon: Map,
        role: 'Dispatcher',
        description: 'Provide route details and special instructions.',
      },
      {
        title: 'Dispatch Communication Log',
        href: '/forms/dispatch-communication-log',
        icon: MessageSquare,
        role: 'Dispatcher',
        description: 'Track communications with drivers.',
      },
      {
        title: 'Exception/Delay Report',
        href: '/forms/exception-delay-report',
        icon: Clock,
        role: 'Dispatcher',
        description: 'Report delays or exceptions during transit.',
      },
      {
        title: 'Driver Availability Board',
        href: '/forms/driver-availability-board',
        icon: Users,
        role: 'Dispatcher',
        description: 'Track driver availability and status.',
      },
      {
        title: 'Customer Contact Sheet',
        href: '/forms/customer-contact-sheet',
        icon: Contact,
        description: 'Log customer contact information and notes.',
        role: 'Dispatcher'
      },
      {
        title: 'Load Confirmation Sheet',
        href: '/forms/load-confirmation-sheet',
        icon: FileCheck2,
        role: 'Dispatcher',
        description: 'Confirm load details with shippers/brokers.',
      },
      {
        title: 'Detention/Wait Time Report',
        href: '/forms/detention-wait-time-report',
        icon: Timer,
        description: 'Track and report waiting times at facilities.',
        role: 'Dispatcher'
      },
      {
        title: 'Driver Handover Checklist',
        href: '/forms/driver-handover-checklist',
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
        href: '/forms/driver-qualification-file',
        icon: UserCheck,
        role: 'Driver Manager',
        description: 'Checklist for required driver documents.',
      },
      {
        title: 'Driver Performance Evaluation',
        href: '/forms/driver-performance-evaluation',
        icon: User,
        role: 'Driver Manager',
        description: 'Regular assessment of driver performance.',
      },
       {
        title: 'Incident/Accident Review',
        href: '/forms/incident-accident-review',
        icon: FileQuestion,
        description: 'Internal review of reported incidents.',
        role: 'Driver Manager'
      },
      {
        title: 'Disciplinary Action Log',
        href: '/forms/disciplinary-action-log',
        icon: FileEdit,
        role: 'Driver Manager',
        description: 'Document coaching or corrective actions.',
      },
      {
        title: 'Driver File Update Form',
        href: '/forms/driver-file-update-form',
        icon: UserCog,
        description: 'Log updates to a driver\'s file.',
        role: 'Driver Manager'
      },
      {
        title: 'Safety Meeting Attendance',
        href: '/forms/safety-meeting-attendance',
        icon: ClipboardCheck,
        role: 'Driver Manager',
        description: 'Record attendance for safety meetings.',
      },
      {
        title: 'Driver Complaint/Feedback',
        href: '/forms/driver-complaint-feedback',
        icon: MessageCircle,
        description: 'Log and address driver feedback.',
        role: 'Driver Manager'
      },
      {
        title: 'Injury/Illness Report',
        href: '/forms/injury-illness-report',
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
        href: '/forms/maintenance-repair-log',
        icon: Wrench,
        role: 'Owner-Operator',
        description: 'Track all vehicle maintenance and repairs.',
      },
      {
        title: 'Expense Report',
        href: '/forms/expense-report',
        icon: DollarSign,
        role: 'Owner-Operator',
        description: 'Record operational expenses.',
      },
      {
        title: 'Income/Settlement Statement',
        href: '/forms/income-settlement-statement',
        icon: Receipt,
        role: 'Owner-Operator',
        description: 'Summarize loads and payments received.',
      },
      {
        title: 'Insurance Certificate Submission',
        href: '/forms/insurance-certificate-submission',
        icon: FileUp,
        description: 'Submit proof of insurance.',
        role: 'Owner-Operator'
      },
      {
        title: 'IFTA Fuel Tax Report',
        href: '/forms/ifta-fuel-tax-report',
        icon: BadgePercent,
        role: 'Owner-Operator',
        description: 'File quarterly fuel tax reports.',
      },
       {
        title: 'Lease Agreement Form',
        href: '/forms/lease-agreement-form',
        icon: FileBadge,
        role: 'Owner-Operator',
        description: 'Manage lease agreements.',
      },
      {
        title: 'Tax Forms (1099/W-9)',
        href: '/forms/tax-forms',
        icon: BookCopy,
        description: 'Submit and manage tax documentation.',
        role: 'Owner-Operator'
      },
      {
        title: 'Operating Authority/MC Number',
        href: '/forms/operating-authority-mc-number',
        icon: FileBadge,
        description: 'Application or record of operating authority.',
        role: 'Owner-Operator'
      },
      {
        title: 'Equipment Ownership/Title',
        href: '/forms/equipment-ownership-title',
        icon: Car,
        description: 'Documentation for equipment titles.',
        role: 'Owner-Operator'
      },
      {
        title: 'Business License/Permits',
        href: '/forms/business-license-permits',
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
        href: '/forms/training-attendance-sheet',
        icon: BookUser,
        role: 'Teacher/Trainer',
        description: 'Record attendance for training sessions.',
      },
       {
        title: 'Skills Assessment Checklist',
        href: '/forms/skills-assessment-checklist',
        icon: ClipboardCheck,
        role: 'Teacher/Trainer',
        description: 'Document completion of required skills.',
      },
       {
        title: 'Training Evaluation Form',
        href: '/forms/training-evaluation-form',
        icon: GraduationCap,
        role: 'Teacher/Trainer',
        description: 'Assess trainee comprehension and performance.',
      },
      {
        title: 'Certification Completion Report',
        href: '/forms/certification-completion-report',
        icon: FileCheck2,
        description: 'Confirm trainees have met certification requirements.',
        role: 'Teacher/Trainer'
      },
      {
        title: 'Trainee Feedback/Survey',
        href: '/forms/trainee-feedback-survey',
        icon: MessageSquare,
        description: 'Collect feedback from trainees.',
        role: 'Teacher/Trainer'
      },
      {
        title: 'Incident/Observation Report',
        href: '/forms/incident-observation-report',
        icon: Pencil,
        description: 'Document issues or notable events during training.',
        role: 'Teacher/Trainer'
      },
       {
        title: 'Lesson Plan Submission',
        href: '/forms/lesson-plan-submission',
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
        href: '/forms/pre-post-trip-inspection',
        icon: FilePlus2,
        description: 'Complete a pre or post-trip inspection.'
    }
]
