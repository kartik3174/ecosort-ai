import type { ChartConfig } from "@/components/ui/chart"

export const citizenStats = [
  { title: "Reports Submitted", value: "142", icon: "FileText" },
  { title: "Locations Cleaned", value: "89", icon: "MapPin" },
  { title: "Eco Contribution Score", value: "1,280", icon: "Leaf" },
  { title: "Pending Reports", value: "12", icon: "Hourglass" },
];

export const officialStats = [
  { title: "Total Reports", value: "3,456", icon: "ClipboardList" },
  { title: "Pending Cleanup", value: "214", icon: "Trash2" },
  { title: "Hazard Alerts", value: "17", icon: "AlertTriangle" },
  { title: "Cleaned Locations", value: "2,890", icon: "CheckCircle" },
];

export const myReportsData = [
  { id: "REP001", location: "Marina Beach", status: "Cleaned", date: "2024-05-20" },
  { id: "REP002", location: "T. Nagar Market", status: "In Progress", date: "2024-05-22" },
  { id: "REP003", location: "Guindy National Park", status: "Pending", date: "2024-05-23" },
  { id: "REP004", location: "Besant Nagar Beach", status: "Cleaned", date: "2024-05-18" },
  { id: "REP005", location: "Vandalur Zoo Entrance", status: "Pending", date: "2024-05-24" },
];

export const allReportsData = [
  { id: "REP301", location: "Adyar River Bank", status: "Pending", priority: "High", time: "2 hours ago", image: "https://picsum.photos/seed/301/200/150", wasteType: "Hazardous" },
  { id: "REP302", location: "Mylapore Tank", status: "Pending", priority: "Medium", time: "5 hours ago", image: "https://picsum.photos/seed/302/200/150", wasteType: "Recyclable" },
  { id: "REP303", location: "Velachery Main Road", status: "In Progress", priority: "Low", time: "1 day ago", image: "https://picsum.photos/seed/303/200/150", wasteType: "General" },
  { id: "REP304", location: "Nungambakkam High Rd", status: "Cleaned", priority: "N/A", time: "2 days ago", image: "https://picsum.photos/seed/304/200/150", wasteType: "General" },
];

export const alertsData = [
    { id: "HAZ01", type: "Broken Glass", location: "Adyar River Bank", time: "2 hours ago", severity: "High" },
    { id: "HAZ02", type: "Used Batteries", location: "Ekkaduthangal", time: "8 hours ago", severity: "Medium" },
    { id: "HAZ03", type: "Medical Waste", location: "Porur Junction", time: "1 day ago", severity: "Critical" },
];

export const areaChartData = [
  { area: "Adyar", reports: 278, cleaned: 230 },
  { area: "T. Nagar", reports: 189, cleaned: 150 },
  { area: "Mylapore", reports: 320, cleaned: 280 },
  { area: "Velachery", reports: 250, cleaned: 200 },
  { area: "Guindy", reports: 150, cleaned: 120 },
  { area: "Nungambakkam", reports: 210, cleaned: 190 },
];

export const areaChartConfig = {
  reports: {
    label: "Reports",
    color: "hsl(var(--primary))",
  },
  cleaned: {
    label: "Cleaned",
    color: "hsl(var(--secondary-foreground))",
  },
} satisfies ChartConfig

export const trendsChartData = [
  { month: "January", reports: 186, hazardous: 10 },
  { month: "February", reports: 305, hazardous: 15 },
  { month: "March", reports: 237, hazardous: 12 },
  { month: "April", reports: 273, hazardous: 20 },
  { month: "May", reports: 209, hazardous: 18 },
  { month: "June", reports: 214, hazardous: 25 },
];

export const trendsChartConfig = {
  reports: {
    label: "Total Reports",
    color: "hsl(var(--primary))",
  },
  hazardous: {
    label: "Hazardous Reports",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig
