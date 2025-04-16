export type Employee = {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  avatarUrl: string;
  company: string;
  businessUnit: string;
  department: string;
  division: string;
  enabledModules: string[];
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  avatarUrl: string;
  company: string;
  businessUnit: string;
  department: string;
  division: string;
  accessTypes: AdminAccessType[];
};

export type AdminAccessType = 
  | 'Platform Admin'
  | 'Goal Admin'
  | 'Review Admin'
  | 'Engagement Admin'
  | '1:1 Admin'
  | 'Feedback Admin';

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  level: 'company' | 'organization';
  enabled: boolean;
  companies: string[];
};

export const modules = [
  'Goals',
  'Reviews',
  'Engagement',
  '1:1 Meetings',
  'Feedback',
  'Recognition',
  'Performance'
];

export const accessTypes: AdminAccessType[] = [
  'Platform Admin',
  'Goal Admin',
  'Review Admin',
  'Engagement Admin',
  '1:1 Admin',
  'Feedback Admin'
];

export const companies = ['Acme Inc.', 'TechCorp', 'Innovate Solutions', 'Global Enterprises'];

export const businessUnits = ['Sales', 'Marketing', 'Engineering', 'Operations', 'HR'];

export const departments = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];

export const divisions = ['Enterprise', 'SMB', 'Consumer', 'Government'];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    employeeCode: 'EMP001',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    company: 'Acme Inc.',
    businessUnit: 'Sales',
    department: 'North America',
    division: 'Enterprise',
    enabledModules: ['Goals', 'Reviews', 'Engagement']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    employeeCode: 'EMP002',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    company: 'Acme Inc.',
    businessUnit: 'Marketing',
    department: 'Europe',
    division: 'SMB',
    enabledModules: ['Goals', 'Feedback', 'Recognition']
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@techcorp.com',
    employeeCode: 'EMP003',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    company: 'TechCorp',
    businessUnit: 'Engineering',
    department: 'Asia Pacific',
    division: 'Consumer',
    enabledModules: ['Reviews', '1:1 Meetings', 'Performance']
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@techcorp.com',
    employeeCode: 'EMP004',
    avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    company: 'TechCorp',
    businessUnit: 'Operations',
    department: 'Latin America',
    division: 'Government',
    enabledModules: ['Engagement', 'Feedback', 'Recognition']
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@innovate.com',
    employeeCode: 'EMP005',
    avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    company: 'Innovate Solutions',
    businessUnit: 'HR',
    department: 'North America',
    division: 'Enterprise',
    enabledModules: ['Goals', 'Reviews', 'Performance']
  },
  {
    id: '6',
    name: 'Diana Miller',
    email: 'diana.miller@global.com',
    employeeCode: 'EMP006',
    avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    company: 'Global Enterprises',
    businessUnit: 'Sales',
    department: 'Europe',
    division: 'SMB',
    enabledModules: ['1:1 Meetings', 'Feedback', 'Recognition']
  },
  {
    id: '7',
    name: 'Edward Davis',
    email: 'edward.davis@global.com',
    employeeCode: 'EMP007',
    avatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    company: 'Global Enterprises',
    businessUnit: 'Marketing',
    department: 'Asia Pacific',
    division: 'Consumer',
    enabledModules: ['Goals', 'Engagement', 'Performance']
  },
  {
    id: '8',
    name: 'Fiona Wilson',
    email: 'fiona.wilson@acme.com',
    employeeCode: 'EMP008',
    avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
    company: 'Acme Inc.',
    businessUnit: 'Engineering',
    department: 'Latin America',
    division: 'Government',
    enabledModules: ['Reviews', '1:1 Meetings', 'Feedback']
  }
];

export const mockAdmins: Admin[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    employeeCode: 'EMP001',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    company: 'Acme Inc.',
    businessUnit: 'Sales',
    department: 'North America',
    division: 'Enterprise',
    accessTypes: ['Platform Admin', 'Goal Admin']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    employeeCode: 'EMP002',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    company: 'Acme Inc.',
    businessUnit: 'Marketing',
    department: 'Europe',
    division: 'SMB',
    accessTypes: ['Review Admin', 'Feedback Admin']
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@techcorp.com',
    employeeCode: 'EMP003',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    company: 'TechCorp',
    businessUnit: 'Engineering',
    department: 'Asia Pacific',
    division: 'Consumer',
    accessTypes: ['Engagement Admin', '1:1 Admin']
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@techcorp.com',
    employeeCode: 'EMP004',
    avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    company: 'TechCorp',
    businessUnit: 'Operations',
    department: 'Latin America',
    division: 'Government',
    accessTypes: ['Platform Admin', 'Review Admin']
  }
];

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: '1',
    name: 'AI Features',
    description: 'Enable AI-powered features across the platform',
    level: 'company',
    enabled: true,
    companies: ['Acme Inc.', 'TechCorp']
  },
  {
    id: '2',
    name: 'Text Messaging',
    description: 'Enable text message notifications for all users',
    level: 'organization',
    enabled: false,
    companies: ['Acme Inc.', 'TechCorp', 'Innovate Solutions', 'Global Enterprises']
  }
];

// Organization hierarchy for the tree filter
export const organizationHierarchy = [
  {
    id: 'acme',
    name: 'Acme Inc.',
    children: [
      {
        id: 'acme-sales',
        name: 'Sales',
        children: [
          {
            id: 'acme-sales-na',
            name: 'North America',
            children: [
              { id: 'acme-sales-na-enterprise', name: 'Enterprise' },
              { id: 'acme-sales-na-smb', name: 'SMB' }
            ]
          },
          {
            id: 'acme-sales-eu',
            name: 'Europe',
            children: [
              { id: 'acme-sales-eu-enterprise', name: 'Enterprise' },
              { id: 'acme-sales-eu-smb', name: 'SMB' }
            ]
          }
        ]
      },
      {
        id: 'acme-marketing',
        name: 'Marketing',
        children: [
          {
            id: 'acme-marketing-eu',
            name: 'Europe',
            children: [
              { id: 'acme-marketing-eu-smb', name: 'SMB' }
            ]
          }
        ]
      },
      {
        id: 'acme-engineering',
        name: 'Engineering',
        children: [
          {
            id: 'acme-engineering-latam',
            name: 'Latin America',
            children: [
              { id: 'acme-engineering-latam-gov', name: 'Government' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'techcorp',
    name: 'TechCorp',
    children: [
      {
        id: 'techcorp-engineering',
        name: 'Engineering',
        children: [
          {
            id: 'techcorp-engineering-apac',
            name: 'Asia Pacific',
            children: [
              { id: 'techcorp-engineering-apac-consumer', name: 'Consumer' }
            ]
          }
        ]
      },
      {
        id: 'techcorp-operations',
        name: 'Operations',
        children: [
          {
            id: 'techcorp-operations-latam',
            name: 'Latin America',
            children: [
              { id: 'techcorp-operations-latam-gov', name: 'Government' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'innovate',
    name: 'Innovate Solutions',
    children: [
      {
        id: 'innovate-hr',
        name: 'HR',
        children: [
          {
            id: 'innovate-hr-na',
            name: 'North America',
            children: [
              { id: 'innovate-hr-na-enterprise', name: 'Enterprise' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'global',
    name: 'Global Enterprises',
    children: [
      {
        id: 'global-sales',
        name: 'Sales',
        children: [
          {
            id: 'global-sales-eu',
            name: 'Europe',
            children: [
              { id: 'global-sales-eu-smb', name: 'SMB' }
            ]
          }
        ]
      },
      {
        id: 'global-marketing',
        name: 'Marketing',
        children: [
          {
            id: 'global-marketing-apac',
            name: 'Asia Pacific',
            children: [
              { id: 'global-marketing-apac-consumer', name: 'Consumer' }
            ]
          }
        ]
      }
    ]
  }
];