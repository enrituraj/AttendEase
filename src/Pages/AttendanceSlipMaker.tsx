// import { useState, useRef, useEffect } from 'react';
// import { FileText, Download, Plus, Settings, Users, Calendar, BookOpen, Trash2 } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import html2canvas from 'html2canvas';

// interface GlobalSettings {
//   heading: string;
//   subheading: string;
// }

// interface SubjectInfo {
//   id: string;
//   subject: string;
//   subjectCode: string;
//   branch: string;
//   semester: string;
//   totalStudents: number;
// }

// interface AttendanceRecord {
//   id: string;
//   subjectId: string;
//   date: string;
//   time: string;
//   presentStudents: string[];
// }

// const STORAGE_KEYS = {
//   GLOBAL_SETTINGS: 'attendance_global_settings',
//   SUBJECTS: 'attendance_subjects',
//   RECORDS: 'attendance_records'
// };

// export default function AttendanceSlipMaker() {
//   const slipRef = useRef<HTMLDivElement>(null);

//   // Global Settings
//   const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
//     heading: 'Attendance Slip',
//     subheading: 'AttendEase - Real-time Attendance System'
//   });

//   // Subjects
//   const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

//   // Attendance Records
//   const [records, setRecords] = useState<AttendanceRecord[]>([]);
//   const [selectedRecordId, setSelectedRecordId] = useState<string>('');

//   // Forms
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
//   const [subjectForm, setSubjectForm] = useState<SubjectInfo>({
//     id: '',
//     subject: '',
//     subjectCode: '',
//     branch: '',
//     semester: '',
//     totalStudents: 0
//   });

//   // Attendance Input
//   const [attendanceInput, setAttendanceInput] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
//   const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));

//   // Load from localStorage
//   useEffect(() => {
//     const savedSettings = localStorage.getItem(STORAGE_KEYS.GLOBAL_SETTINGS);
//     const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
//     const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);

//     if (savedSettings) setGlobalSettings(JSON.parse(savedSettings));
//     if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
//     if (savedRecords) setRecords(JSON.parse(savedRecords));
//   }, []);

//   // Save to localStorage
//   const saveGlobalSettings = (settings: GlobalSettings) => {
//     localStorage.setItem(STORAGE_KEYS.GLOBAL_SETTINGS, JSON.stringify(settings));
//     setGlobalSettings(settings);
//   };

//   const saveSubjects = (newSubjects: SubjectInfo[]) => {
//     localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(newSubjects));
//     setSubjects(newSubjects);
//   };

//   const saveRecords = (newRecords: AttendanceRecord[]) => {
//     localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(newRecords));
//     setRecords(newRecords);
//   };

//   // Subject Management
//   const handleAddSubject = () => {
//     if (!subjectForm.subject || !subjectForm.subjectCode || !subjectForm.branch || !subjectForm.semester) {
//       alert('Please fill all fields');
//       return;
//     }

//     const newSubject: SubjectInfo = {
//       ...subjectForm,
//       id: Date.now().toString()
//     };

//     saveSubjects([...subjects, newSubject]);
//     setSubjectForm({
//       id: '',
//       subject: '',
//       subjectCode: '',
//       branch: '',
//       semester: '',
//       totalStudents: 0
//     });
//     setIsSubjectFormOpen(false);
//   };

//   const handleDeleteSubject = (id: string) => {
//     if (!confirm('Delete this subject? All attendance records will also be deleted.')) return;

//     saveSubjects(subjects.filter(s => s.id !== id));
//     saveRecords(records.filter(r => r.subjectId !== id));

//     if (selectedSubjectId === id) {
//       setSelectedSubjectId('');
//       setSelectedRecordId('');
//     }
//   };

//   // Attendance Processing
//   const formatRollNumber = (num: string): string => {
//     const trimmed = num.trim();
//     if (trimmed.length === 0) return '';

//     const number = parseInt(trimmed);
//     if (isNaN(number)) return '';

//     if (number >= 1 && number <= 100) {
//       return number.toString().padStart(2, '0');
//     }

//     return number.toString();
//   };

//   const handleAttendanceSubmit = () => {
//     if (!selectedSubjectId) {
//       alert('Please select a subject');
//       return;
//     }

//     const numbers = attendanceInput
//       .split(/[\s,]+/)
//       .map(formatRollNumber)
//       .filter(n => n !== '');

//     const uniqueNumbers = Array.from(new Set(numbers)).sort((a, b) => {
//       return parseInt(a) - parseInt(b);
//     });

//     const newRecord: AttendanceRecord = {
//       id: Date.now().toString(),
//       subjectId: selectedSubjectId,
//       date: currentDate,
//       time: currentTime,
//       presentStudents: uniqueNumbers
//     };

//     const updatedRecords = [...records, newRecord];
//     saveRecords(updatedRecords);
//     setSelectedRecordId(newRecord.id);
//     setAttendanceInput('');

//     alert(`Attendance saved! ${uniqueNumbers.length} students marked present.`);
//   };

//   const handleDeleteRecord = (id: string) => {
//     if (!confirm('Delete this attendance record?')) return;

//     saveRecords(records.filter(r => r.id !== id));
//     if (selectedRecordId === id) {
//       setSelectedRecordId('');
//     }
//   };

//   // Download
//   const handleDownload = async () => {
//     if (!slipRef.current || !selectedRecordId) return;

//     try {
//       const canvas = await html2canvas(slipRef.current, {
//         backgroundColor: '#ffffff',
//         scale: 2,
//       });

//       const link = document.createElement('a');
//       const record = records.find(r => r.id === selectedRecordId);
//       const subject = subjects.find(s => s.id === record?.subjectId);
//       link.download = `attendance-${subject?.subjectCode || 'slip'}-${record?.date}.jpg`;
//       link.href = canvas.toDataURL('image/jpeg', 0.95);
//       link.click();
//     } catch (error) {
//       alert('Download failed');
//     }
//   };

//   // Get filtered records
//   const filteredRecords = selectedSubjectId 
//     ? records.filter(r => r.subjectId === selectedSubjectId)
//     : [];

//   const selectedRecord = records.find(r => r.id === selectedRecordId);
//   const selectedSubject = subjects.find(s => s.id === (selectedRecord?.subjectId || selectedSubjectId));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Attendance Slip Maker</h1>
//             <p className="text-slate-600 mt-1">Create and manage attendance records</p>
//           </div>

//           <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Settings className="mr-2 h-4 w-4" />
//                 Settings
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Global Settings</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Heading</Label>
//                   <Input
//                     value={globalSettings.heading}
//                     onChange={(e) => setGlobalSettings({ ...globalSettings, heading: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Subheading</Label>
//                   <Input
//                     value={globalSettings.subheading}
//                     onChange={(e) => setGlobalSettings({ ...globalSettings, subheading: e.target.value })}
//                   />
//                 </div>
//                 <Button onClick={() => {
//                   saveGlobalSettings(globalSettings);
//                   setIsSettingsOpen(false);
//                 }} className="w-full bg-primary">
//                   Save Settings
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Panel - Subject & Attendance Input */}
//           <div className="space-y-6">
//             {/* Subject Management */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <BookOpen className="h-5 w-5 text-primary" />
//                   Subjects
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {subjects.map(subject => (
//                   <div key={subject.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm">{subject.subject}</p>
//                       <p className="text-xs text-slate-600">{subject.subjectCode} • {subject.branch} Sem {subject.semester}</p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleDeleteSubject(subject.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 ))}

//                 <Dialog open={isSubjectFormOpen} onOpenChange={setIsSubjectFormOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="w-full">
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Subject
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Add New Subject</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label>Subject Name</Label>
//                         <Input
//                           value={subjectForm.subject}
//                           onChange={(e) => setSubjectForm({ ...subjectForm, subject: e.target.value })}
//                           placeholder="e.g., Data Structures"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Subject Code</Label>
//                         <Input
//                           value={subjectForm.subjectCode}
//                           onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
//                           placeholder="e.g., CS201"
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Branch</Label>
//                           <Input
//                             value={subjectForm.branch}
//                             onChange={(e) => setSubjectForm({ ...subjectForm, branch: e.target.value })}
//                             placeholder="e.g., CSE"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Semester</Label>
//                           <Input
//                             value={subjectForm.semester}
//                             onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
//                             placeholder="e.g., 3"
//                           />
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Total Students</Label>
//                         <Input
//                           type="number"
//                           value={subjectForm.totalStudents || ''}
//                           onChange={(e) => setSubjectForm({ ...subjectForm, totalStudents: parseInt(e.target.value) || 0 })}
//                           placeholder="e.g., 60"
//                         />
//                       </div>
//                       <Button onClick={handleAddSubject} className="w-full bg-primary">
//                         Add Subject
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </CardContent>
//             </Card>

//             {/* Attendance Input */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Users className="h-5 w-5 text-primary" />
//                   Mark Attendance
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Select Subject</Label>
//                   <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose subject" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {subjects.map(s => (
//                         <SelectItem key={s.id} value={s.id}>
//                           {s.subject} ({s.subjectCode})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label>Date</Label>
//                     <Input
//                       type="date"
//                       value={currentDate}
//                       onChange={(e) => setCurrentDate(e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Time</Label>
//                     <Input
//                       type="time"
//                       value={currentTime}
//                       onChange={(e) => setCurrentTime(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Roll Numbers (space or comma separated)</Label>
//                   <textarea
//                     className="w-full min-h-[120px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     value={attendanceInput}
//                     onChange={(e) => setAttendanceInput(e.target.value)}
//                     placeholder="Enter roll numbers: 1 2 12 45 901"
//                   />
//                   <p className="text-xs text-slate-500">
//                     1-100 will be formatted as 01-100. 101+ stays as is.
//                   </p>
//                 </div>

//                 <Button 
//                   onClick={handleAttendanceSubmit}
//                   className="w-full bg-primary"
//                   disabled={!selectedSubjectId}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Save Attendance
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Saved Records */}
//             {filteredRecords.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Calendar className="h-5 w-5 text-primary" />
//                     Saved Records
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   {filteredRecords.map(record => (
//                     <div
//                       key={record.id}
//                       className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
//                         selectedRecordId === record.id ? 'bg-primary text-white' : 'bg-slate-50 hover:bg-slate-100'
//                       }`}
//                       onClick={() => setSelectedRecordId(record.id)}
//                     >
//                       <div className="flex-1">
//                         <p className="font-semibold text-sm">{record.date}</p>
//                         <p className={`text-xs ${selectedRecordId === record.id ? 'text-white/80' : 'text-slate-600'}`}>
//                           {record.time} • {record.presentStudents.length} present
//                         </p>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteRecord(record.id);
//                         }}
//                       >
//                         <Trash2 className={`h-4 w-4 ${selectedRecordId === record.id ? 'text-white' : 'text-red-500'}`} />
//                       </Button>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Panel - Preview & Download */}
//           <Card className="lg:col-span-2">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <FileText className="h-5 w-5 text-primary" />
//                 Preview
//               </CardTitle>
//               <Button
//                 onClick={handleDownload}
//                 disabled={!selectedRecordId}
//                 className="bg-primary"
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 Download JPG
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div 
//                 ref={slipRef}
//                 className="bg-white p-8 rounded-lg border border-slate-200 min-h-[500px]"
//               >
//                 {selectedRecord && selectedSubject ? (
//                   <div className="space-y-6">
//                     {/* Header */}
//                     <div className="text-center border-b pb-4">
//                       <h2 className="text-2xl font-bold text-slate-900">
//                         {globalSettings.heading}
//                       </h2>
//                       <p className="mt-2 text-slate-600">{globalSettings.subheading}</p>
//                     </div>

//                     {/* Subject Info */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-1">
//                         <p className="text-sm text-slate-500">Subject</p>
//                         <p className="font-semibold text-slate-900">{selectedSubject.subject}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-slate-500">Code</p>
//                         <p className="font-mono font-semibold text-slate-900">{selectedSubject.subjectCode}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-slate-500">Branch & Semester</p>
//                         <p className="font-semibold text-slate-900">{selectedSubject.branch} - Sem {selectedSubject.semester}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-slate-500">Date & Time</p>
//                         <p className="font-semibold text-slate-900">{selectedRecord.date} • {selectedRecord.time}</p>
//                       </div>
//                     </div>

//                     {/* Present Students */}
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <p className="font-semibold text-slate-900">Present Students</p>
//                         <p className="text-slate-600">
//                           {selectedRecord.presentStudents.length} / {selectedSubject.totalStudents}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
//                         {selectedRecord.presentStudents.map((rollNo, i) => (
//                           <div 
//                             key={i}
//                             className="aspect-square rounded-lg flex items-center justify-center font-mono font-bold bg-primary/10 border border-primary/30 text-primary"
//                           >
//                             {rollNo}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="text-center pt-4 border-t text-slate-500 text-sm">
//                       Generated on {new Date().toLocaleDateString('en-IN', {
//                         day: '2-digit',
//                         month: 'long',
//                         year: 'numeric',
//                       })}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
//                     <FileText className="h-16 w-16 mb-4" />
//                     <p className="text-lg font-medium">No record selected</p>
//                     <p className="text-sm mt-1">Mark attendance and select a record to preview</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useRef, useEffect } from 'react';
// import { FileText, Download, Plus, Settings, Users, Calendar, BookOpen, Trash2, UserPlus, Type, Palette } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Slider } from '@/components/ui/slider';
// import { toJpeg } from 'html-to-image';

// interface GlobalSettings {
//   heading: string;
//   subheading: string;
// }

// interface SubjectInfo {
//   id: string;
//   subject: string;
//   subjectCode: string;
//   branch: string;
//   semester: string;
//   totalStudents: number;
// }

// interface Student {
//   rollNo: string;
//   subjectId: string;
// }

// interface AttendanceRecord {
//   id: string;
//   subjectId: string;
//   date: string;
//   time: string;
//   presentStudents: string[];
// }

// const STORAGE_KEYS = {
//   GLOBAL_SETTINGS: 'attendance_global_settings',
//   SUBJECTS: 'attendance_subjects',
//   STUDENTS: 'attendance_students',
//   RECORDS: 'attendance_records'
// };

// export default function AttendanceSlipMaker() {
//   const slipRef = useRef<HTMLDivElement>(null);

//   // Global Settings
//   const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
//     heading: 'Attendance Slip',
//     subheading: 'AttendEase - Real-time Attendance System'
//   });

//   // Subjects
//   const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

//   // Students
//   const [students, setStudents] = useState<Student[]>([]);
//   const [newRollNo, setNewRollNo] = useState('');

//   // Attendance Records
//   const [records, setRecords] = useState<AttendanceRecord[]>([]);
//   const [selectedRecordId, setSelectedRecordId] = useState<string>('');

//   // Current attendance (live editing)
//   const [currentPresentStudents, setCurrentPresentStudents] = useState<string[]>([]);
//   const [manualRollInput, setManualRollInput] = useState('');

//   // Forms
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
//   const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
//   const [subjectForm, setSubjectForm] = useState<SubjectInfo>({
//     id: '',
//     subject: '',
//     subjectCode: '',
//     branch: '',
//     semester: '',
//     totalStudents: 0
//   });

//   // Customization
//   const [fontSize, setFontSize] = useState(14);
//   const [textColor, setTextColor] = useState('#1e293b');
//   const [bgColor, setBgColor] = useState('#ffffff');

//   // Date & Time
//   const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
//   const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));

//   // Load from localStorage
//   useEffect(() => {
//     const savedSettings = localStorage.getItem(STORAGE_KEYS.GLOBAL_SETTINGS);
//     const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
//     const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
//     const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);

//     if (savedSettings) setGlobalSettings(JSON.parse(savedSettings));
//     if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
//     if (savedStudents) setStudents(JSON.parse(savedStudents));
//     if (savedRecords) setRecords(JSON.parse(savedRecords));
//   }, []);

//   // Save to localStorage
//   const saveGlobalSettings = (settings: GlobalSettings) => {
//     localStorage.setItem(STORAGE_KEYS.GLOBAL_SETTINGS, JSON.stringify(settings));
//     setGlobalSettings(settings);
//   };

//   const saveSubjects = (newSubjects: SubjectInfo[]) => {
//     localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(newSubjects));
//     setSubjects(newSubjects);
//   };

//   const saveStudents = (newStudents: Student[]) => {
//     localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
//     setStudents(newStudents);
//   };

//   const saveRecords = (newRecords: AttendanceRecord[]) => {
//     localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(newRecords));
//     setRecords(newRecords);
//   };

//   // Subject Management
//   const handleAddSubject = () => {
//     if (!subjectForm.subject || !subjectForm.subjectCode || !subjectForm.branch || !subjectForm.semester) {
//       alert('Please fill all fields');
//       return;
//     }

//     const newSubject: SubjectInfo = {
//       ...subjectForm,
//       id: Date.now().toString()
//     };

//     saveSubjects([...subjects, newSubject]);
//     setSubjectForm({
//       id: '',
//       subject: '',
//       subjectCode: '',
//       branch: '',
//       semester: '',
//       totalStudents: 0
//     });
//     setIsSubjectFormOpen(false);
//   };

//   const handleDeleteSubject = (id: string) => {
//     if (!confirm('Delete this subject? All related students and attendance records will also be deleted.')) return;

//     saveSubjects(subjects.filter(s => s.id !== id));
//     saveStudents(students.filter(s => s.subjectId !== id));
//     saveRecords(records.filter(r => r.subjectId !== id));

//     if (selectedSubjectId === id) {
//       setSelectedSubjectId('');
//       setSelectedRecordId('');
//       setCurrentPresentStudents([]);
//     }
//   };

//   // Student Management
//   const formatRollNumber = (num: string): string => {
//     const trimmed = num.trim();
//     if (trimmed.length === 0) return '';

//     const number = parseInt(trimmed);
//     if (isNaN(number)) return '';

//     if (number >= 1 && number <= 100) {
//       return number.toString().padStart(2, '0');
//     }

//     return number.toString();
//   };

//   const handleAddStudent = () => {
//     if (!selectedSubjectId) {
//       alert('Please select a subject first');
//       return;
//     }

//     const formatted = formatRollNumber(newRollNo);
//     if (!formatted) {
//       alert('Invalid roll number');
//       return;
//     }

//     const exists = students.some(s => s.rollNo === formatted && s.subjectId === selectedSubjectId);
//     if (exists) {
//       alert('Student already exists');
//       return;
//     }

//     const newStudent: Student = {
//       rollNo: formatted,
//       subjectId: selectedSubjectId
//     };

//     saveStudents([...students, newStudent]);
//     setNewRollNo('');
//   };

//   const handleDeleteStudent = (rollNo: string) => {
//     saveStudents(students.filter(s => !(s.rollNo === rollNo && s.subjectId === selectedSubjectId)));
//     setCurrentPresentStudents(currentPresentStudents.filter(r => r !== rollNo));
//   };

//   const handleAddManualRoll = () => {
//     if (!selectedSubjectId) {
//       alert('Please select a subject first');
//       return;
//     }

//     const formatted = formatRollNumber(manualRollInput);
//     if (!formatted) {
//       alert('Invalid roll number');
//       return;
//     }

//     if (!currentPresentStudents.includes(formatted)) {
//       setCurrentPresentStudents([...currentPresentStudents, formatted].sort((a, b) => parseInt(a) - parseInt(b)));
//     }

//     setManualRollInput('');
//   };

//   const toggleStudentPresent = (rollNo: string) => {
//     if (currentPresentStudents.includes(rollNo)) {
//       setCurrentPresentStudents(currentPresentStudents.filter(r => r !== rollNo));
//     } else {
//       setCurrentPresentStudents([...currentPresentStudents, rollNo].sort((a, b) => parseInt(a) - parseInt(b)));
//     }
//   };

//   const handleSaveAttendance = () => {
//     if (!selectedSubjectId) {
//       alert('Please select a subject');
//       return;
//     }

//     if (currentPresentStudents.length === 0) {
//       alert('No students marked present');
//       return;
//     }

//     const newRecord: AttendanceRecord = {
//       id: Date.now().toString(),
//       subjectId: selectedSubjectId,
//       date: currentDate,
//       time: currentTime,
//       presentStudents: [...currentPresentStudents].sort((a, b) => parseInt(a) - parseInt(b))
//     };

//     const updatedRecords = [...records, newRecord];
//     saveRecords(updatedRecords);
//     setSelectedRecordId(newRecord.id);

//     alert(`Attendance saved! ${currentPresentStudents.length} students marked present.`);
//   };

//   const handleDeleteRecord = (id: string) => {
//     if (!confirm('Delete this attendance record?')) return;

//     saveRecords(records.filter(r => r.id !== id));
//     if (selectedRecordId === id) {
//       setSelectedRecordId('');
//     }
//   };

//   // Download
//   //   const handleDownload = async () => {
//   //     if (!slipRef.current || !selectedRecordId) return;

//   //     try {
//   //       const canvas = await html2canvas(slipRef.current, {
//   //         backgroundColor: bgColor,
//   //         scale: 2,
//   //           useCORS: true,
//   //   allowTaint: false,
//   //   foreignObjectRendering: false
//   //       });

//   //       const link = document.createElement('a');
//   //       const record = records.find(r => r.id === selectedRecordId);
//   //       const subject = subjects.find(s => s.id === record?.subjectId);
//   //       link.download = `attendance-${subject?.subjectCode || 'slip'}-${record?.date}.jpg`;
//   //       link.href = canvas.toDataURL('image/jpeg', 0.95);
//   //       link.click();
//   //     } catch (error) {
//   //       alert('Download failed');
//   //     }
//   //   };

//   const handleDownload = async () => {
//     if (!slipRef.current || !selectedRecordId) return;

//     try {
//       const dataUrl = await toJpeg(slipRef.current, {
//         backgroundColor: bgColor,
//         quality: 0.95,
//         fontEmbedCSS: '' // Disable font embedding to prevent "font undefined" crash
//       });

//       const link = document.createElement('a');
//       const record = records.find(r => r.id === selectedRecordId);
//       const subject = subjects.find(s => s.id === record?.subjectId);
//       link.download = `attendance-${subject?.subjectCode || 'slip'}-${record?.date}.jpg`;
//       link.href = dataUrl;
//       link.click();
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.error('handleDownload failed', error);
//       alert('Download failed. See console for details.');
//     }
//   };


//   // Get filtered data
//   const subjectStudents = students.filter(s => s.subjectId === selectedSubjectId);
//   const filteredRecords = selectedSubjectId ? records.filter(r => r.subjectId === selectedSubjectId) : [];
//   const selectedRecord = records.find(r => r.id === selectedRecordId);
//   const selectedSubject = subjects.find(s => s.id === (selectedRecord?.subjectId || selectedSubjectId));

//   // Display students (sorted)
//   const displayStudents = selectedRecord
//     ? [...selectedRecord.presentStudents].sort((a, b) => parseInt(a) - parseInt(b))
//     : [...currentPresentStudents].sort((a, b) => parseInt(a) - parseInt(b));

//   // Reset current attendance when subject changes
//   useEffect(() => {
//     setCurrentPresentStudents([]);
//     setSelectedRecordId('');
//   }, [selectedSubjectId]);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Attendance Slip Maker</h1>
//             <p className="text-slate-600 mt-1">Create and manage attendance records</p>
//           </div>

//           <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Settings className="mr-2 h-4 w-4" />
//                 Settings
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Global Settings</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Heading</Label>
//                   <Input
//                     value={globalSettings.heading}
//                     onChange={(e) => setGlobalSettings({ ...globalSettings, heading: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Subheading</Label>
//                   <Input
//                     value={globalSettings.subheading}
//                     onChange={(e) => setGlobalSettings({ ...globalSettings, subheading: e.target.value })}
//                   />
//                 </div>
//                 <Button onClick={() => {
//                   saveGlobalSettings(globalSettings);
//                   setIsSettingsOpen(false);
//                 }} className="w-full bg-primary">
//                   Save Settings
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Panel - Controls */}
//           <div className="space-y-6">
//             {/* Subject Management */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <BookOpen className="h-5 w-5 text-primary" />
//                   Subjects
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {subjects.map(subject => (
//                   <div key={subject.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm">{subject.subject}</p>
//                       <p className="text-xs text-slate-600">{subject.subjectCode} • {subject.branch} Sem {subject.semester}</p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleDeleteSubject(subject.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 ))}

//                 <Dialog open={isSubjectFormOpen} onOpenChange={setIsSubjectFormOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="w-full">
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Subject
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Add New Subject</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label>Subject Name</Label>
//                         <Input
//                           value={subjectForm.subject}
//                           onChange={(e) => setSubjectForm({ ...subjectForm, subject: e.target.value })}
//                           placeholder="e.g., Data Structures"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Subject Code</Label>
//                         <Input
//                           value={subjectForm.subjectCode}
//                           onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
//                           placeholder="e.g., CS201"
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Branch</Label>
//                           <Input
//                             value={subjectForm.branch}
//                             onChange={(e) => setSubjectForm({ ...subjectForm, branch: e.target.value })}
//                             placeholder="e.g., CSE"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Semester</Label>
//                           <Input
//                             value={subjectForm.semester}
//                             onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
//                             placeholder="e.g., 3"
//                           />
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Total Students</Label>
//                         <Input
//                           type="number"
//                           value={subjectForm.totalStudents || ''}
//                           onChange={(e) => setSubjectForm({ ...subjectForm, totalStudents: parseInt(e.target.value) || 0 })}
//                           placeholder="e.g., 60"
//                         />
//                       </div>
//                       <Button onClick={handleAddSubject} className="w-full bg-primary">
//                         Add Subject
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </CardContent>
//             </Card>

//             {/* Customization */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Palette className="h-5 w-5 text-primary" />
//                   Customize Slip
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Font Size */}
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <Label className="flex items-center gap-2">
//                       <Type className="h-4 w-4" />
//                       Font Size
//                     </Label>
//                     <span className="text-sm text-slate-600">{fontSize}px</span>
//                   </div>
//                   <Slider
//                     value={[fontSize]}
//                     onValueChange={([v]) => setFontSize(v)}
//                     min={10}
//                     max={24}
//                     step={1}
//                   />
//                 </div>

//                 {/* Text Color */}
//                 <div className="space-y-2">
//                   <Label>Text Color</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       type="color"
//                       value={textColor}
//                       onChange={(e) => setTextColor(e.target.value)}
//                       className="w-12 h-10 p-1 cursor-pointer"
//                     />
//                     <Input
//                       value={textColor}
//                       onChange={(e) => setTextColor(e.target.value)}
//                       className="flex-1 font-mono"
//                     />
//                   </div>
//                 </div>

//                 {/* Background Color */}
//                 <div className="space-y-2">
//                   <Label>Background Color</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       type="color"
//                       value={bgColor}
//                       onChange={(e) => setBgColor(e.target.value)}
//                       className="w-12 h-10 p-1 cursor-pointer"
//                     />
//                     <Input
//                       value={bgColor}
//                       onChange={(e) => setBgColor(e.target.value)}
//                       className="flex-1 font-mono"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Saved Records */}
//             {filteredRecords.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Calendar className="h-5 w-5 text-primary" />
//                     Saved Records
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   {filteredRecords.map(record => (
//                     <div
//                       key={record.id}
//                       className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedRecordId === record.id ? 'bg-primary text-white' : 'bg-slate-50 hover:bg-slate-100'
//                         }`}
//                       onClick={() => setSelectedRecordId(record.id)}
//                     >
//                       <div className="flex-1">
//                         <p className="font-semibold text-sm">{record.date}</p>
//                         <p className={`text-xs ${selectedRecordId === record.id ? 'text-white/80' : 'text-slate-600'}`}>
//                           {record.time} • {record.presentStudents.length} present
//                         </p>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteRecord(record.id);
//                         }}
//                       >
//                         <Trash2 className={`h-4 w-4 ${selectedRecordId === record.id ? 'text-white' : 'text-red-500'}`} />
//                       </Button>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Middle Panel - Student List & Attendance */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Users className="h-5 w-5 text-primary" />
//                   Mark Attendance
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Select Subject</Label>
//                   <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose subject" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {subjects.map(s => (
//                         <SelectItem key={s.id} value={s.id}>
//                           {s.subject} ({s.subjectCode})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label>Date</Label>
//                     <Input
//                       type="date"
//                       value={currentDate}
//                       onChange={(e) => setCurrentDate(e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Time</Label>
//                     <Input
//                       type="time"
//                       value={currentTime}
//                       onChange={(e) => setCurrentTime(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Manual Roll Number Input */}
//                 <div className="space-y-2">
//                   <Label>Add Roll Number Manually</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       value={manualRollInput}
//                       onChange={(e) => setManualRollInput(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleAddManualRoll()}
//                       placeholder="Enter roll number"
//                       disabled={!selectedSubjectId}
//                     />
//                     <Button
//                       onClick={handleAddManualRoll}
//                       disabled={!selectedSubjectId}
//                       className="bg-primary"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handleSaveAttendance}
//                   className="w-full bg-primary"
//                   disabled={!selectedSubjectId || currentPresentStudents.length === 0}
//                 >
//                   <Download className="mr-2 h-4 w-4" />
//                   Save Attendance
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Student List */}
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <UserPlus className="h-5 w-5 text-primary" />
//                   Students
//                 </CardTitle>
//                 <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
//                   <DialogTrigger asChild>
//                     <Button size="sm" variant="outline" disabled={!selectedSubjectId}>
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Add Student</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label>Roll Number</Label>
//                         <Input
//                           value={newRollNo}
//                           onChange={(e) => setNewRollNo(e.target.value)}
//                           onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
//                           placeholder="e.g., 1, 12, 901"
//                         />
//                         <p className="text-xs text-slate-500">
//                           1-100 will be formatted as 01-100. 101+ stays as is.
//                         </p>
//                       </div>
//                       <Button onClick={handleAddStudent} className="w-full bg-primary">
//                         Add Student
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </CardHeader>
//               <CardContent>
//                 {!selectedSubjectId ? (
//                   <p className="text-center text-slate-500 py-4">Select a subject first</p>
//                 ) : subjectStudents.length === 0 ? (
//                   <p className="text-center text-slate-500 py-4">No students added yet</p>
//                 ) : (
//                   <div className="space-y-2 max-h-96 overflow-y-auto">
//                     {subjectStudents
//                       .sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo))
//                       .map((student) => {
//                         const isPresent = currentPresentStudents.includes(student.rollNo);
//                         return (
//                           <div
//                             key={student.rollNo}
//                             className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isPresent ? 'bg-primary text-white' : 'bg-slate-50'
//                               }`}
//                           >
//                             <span className="font-mono font-semibold">{student.rollNo}</span>
//                             <div className="flex gap-2">
//                               <Button
//                                 size="sm"
//                                 variant={isPresent ? "secondary" : "default"}
//                                 onClick={() => toggleStudentPresent(student.rollNo)}
//                                 className={isPresent ? '' : 'bg-primary'}
//                               >
//                                 {isPresent ? 'Remove' : 'Present'}
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 onClick={() => handleDeleteStudent(student.rollNo)}
//                               >
//                                 <Trash2 className={`h-4 w-4 ${isPresent ? 'text-white' : 'text-red-500'}`} />
//                               </Button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Panel - Preview */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <FileText className="h-5 w-5 text-primary" />
//                 Preview
//               </CardTitle>
//               <Button
//                 onClick={handleDownload}
//                 disabled={!selectedRecordId}
//                 className="bg-primary"
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 Download JPG
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div
//                 ref={slipRef}
//                 className="p-8 rounded-lg border border-slate-200 min-h-125"
//                 style={{ backgroundColor: bgColor, color: textColor, fontSize: `${fontSize}px` }}
//               >
//                 {(selectedRecord || (selectedSubject && displayStudents.length > 0)) ? (
//                   <div className="space-y-6">
//                     {/* Header */}
//                     <div className="text-center border-b pb-4" style={{ borderColor: textColor + '33' }}>
//                       <h2 className="font-bold" style={{ fontSize: `${fontSize * 1.5}px` }}>
//                         {globalSettings.heading}
//                       </h2>
//                       <p className="mt-2 opacity-75">{globalSettings.subheading}</p>
//                     </div>

//                     {/* Subject Info */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-1">
//                         <p className="opacity-60" style={{ fontSize: `${fontSize * 0.85}px` }}>Subject</p>
//                         <p className="font-semibold">{selectedSubject?.subject}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="opacity-60" style={{ fontSize: `${fontSize * 0.85}px` }}>Code</p>
//                         <p className="font-mono font-semibold">{selectedSubject?.subjectCode}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="opacity-60" style={{ fontSize: `${fontSize * 0.85}px` }}>Branch & Semester</p>
//                         <p className="font-semibold">{selectedSubject?.branch} - Sem {selectedSubject?.semester}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="opacity-60" style={{ fontSize: `${fontSize * 0.85}px` }}>Date & Time</p>
//                         <p className="font-semibold">{selectedRecord ? selectedRecord.date : currentDate} • {selectedRecord ? selectedRecord.time : currentTime}</p>
//                       </div>
//                     </div>

//                     {/* Present Students */}
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <p className="font-semibold">Present Students</p>
//                         <p className="opacity-75">
//                           {displayStudents.length} / {selectedSubject?.totalStudents}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
//                         {displayStudents.map((rollNo, i) => (
//                           <div
//                             key={i}
//                             className="aspect-square rounded-lg flex items-center justify-center font-mono font-bold"
//                             style={{
//                               backgroundColor: textColor + '15',
//                               border: `1px solid ${textColor}33`
//                             }}
//                           >
//                             {rollNo}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="text-center pt-4 border-t opacity-60" style={{ borderColor: textColor + '33', fontSize: `${fontSize * 0.85}px` }}>
//                       Generated on {new Date().toLocaleDateString('en-IN', {
//                         day: '2-digit',
//                         month: 'long',
//                         year: 'numeric',
//                       })}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center text-center py-16 opacity-60">
//                     <FileText className="h-16 w-16 mb-4" />
//                     <p className="text-lg font-medium">No attendance to preview</p>
//                     <p className="text-sm mt-1">Mark students present or select a saved record</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from 'react';
import { FileText, Download, Plus, Settings, BookOpen, Trash2, Type, Palette, X, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toJpeg } from 'html-to-image';

interface GlobalSettings {
  heading: string;
  subheading: string;
}

interface SubjectInfo {
  id: string;
  subject: string;
  subjectCode: string;
  branch: string;
  semester: string;
  totalStudents: number;
}

interface Student {
  rollNo: string;
  subjectId: string;
}

interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  time: string;
  presentStudents: string[];
}

const STORAGE_KEYS = {
  GLOBAL_SETTINGS: 'attendance_global_settings',
  SUBJECTS: 'attendance_subjects',
  STUDENTS: 'attendance_students',
  RECORDS: 'attendance_records'
};

export default function AttendanceSlipMaker() {
  const slipRef = useRef<HTMLDivElement>(null);

  // Global Settings
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    heading: 'Attendance Slip',
    subheading: 'AttendEase - Real-time Attendance System'
  });

  // Subjects
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Students
  const [students, setStudents] = useState<Student[]>([]);
  const [newRollNo, setNewRollNo] = useState('');

  // Attendance Records
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');

  // Current attendance (live editing)
  const [currentPresentStudents, setCurrentPresentStudents] = useState<string[]>([]);
  const [manualRollInput, setManualRollInput] = useState('');

  // Forms
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState<SubjectInfo>({
    id: '',
    subject: '',
    subjectCode: '',
    branch: '',
    semester: '',
    totalStudents: 0
  });

  // Customization
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Date & Time
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));

  // Load from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.GLOBAL_SETTINGS);
    const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);

    if (savedSettings) setGlobalSettings(JSON.parse(savedSettings));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  // Save to localStorage
  const saveGlobalSettings = (settings: GlobalSettings) => {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_SETTINGS, JSON.stringify(settings));
    setGlobalSettings(settings);
  };

  const saveSubjects = (newSubjects: SubjectInfo[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(newSubjects));
    setSubjects(newSubjects);
  };

  const saveStudents = (newStudents: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
    setStudents(newStudents);
  };

  const saveRecords = (newRecords: AttendanceRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  // Subject Management
  const handleAddSubject = () => {
    if (!subjectForm.subject || !subjectForm.subjectCode || !subjectForm.branch || !subjectForm.semester) {
      alert('Please fill all fields');
      return;
    }

    const newSubject: SubjectInfo = {
      ...subjectForm,
      id: Date.now().toString()
    };

    saveSubjects([...subjects, newSubject]);
    setSubjectForm({
      id: '',
      subject: '',
      subjectCode: '',
      branch: '',
      semester: '',
      totalStudents: 0
    });
    setIsSubjectFormOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    if (!confirm('Delete this subject? All related students and attendance records will also be deleted.')) return;

    saveSubjects(subjects.filter(s => s.id !== id));
    saveStudents(students.filter(s => s.subjectId !== id));
    saveRecords(records.filter(r => r.subjectId !== id));

    if (selectedSubjectId === id) {
      setSelectedSubjectId('');
      setSelectedRecordId('');
      setCurrentPresentStudents([]);
    }
  };

  // Student Management
  const formatRollNumber = (num: string): string => {
    const trimmed = num.trim();
    if (trimmed.length === 0) return '';

    const number = parseInt(trimmed);
    if (isNaN(number)) return '';

    if (number >= 1 && number <= 100) {
      return number.toString().padStart(2, '0');
    }

    return number.toString();
  };

  const handleAddStudent = () => {
    if (!selectedSubjectId) {
      alert('Please select a subject first');
      return;
    }

    const formatted = formatRollNumber(newRollNo);
    if (!formatted) {
      alert('Invalid roll number');
      return;
    }

    const exists = students.some(s => s.rollNo === formatted && s.subjectId === selectedSubjectId);
    if (exists) {
      alert('Student already exists');
      return;
    }

    const newStudent: Student = {
      rollNo: formatted,
      subjectId: selectedSubjectId
    };

    saveStudents([...students, newStudent]);
    setNewRollNo('');
  };

  const handleDeleteStudent = (rollNo: string) => {
    saveStudents(students.filter(s => !(s.rollNo === rollNo && s.subjectId === selectedSubjectId)));
    setCurrentPresentStudents(currentPresentStudents.filter(r => r !== rollNo));
  };

  const handleAddManualRoll = () => {
    if (!selectedSubjectId) {
      alert('Please select a subject first');
      return;
    }

    const formatted = formatRollNumber(manualRollInput);
    if (!formatted) {
      alert('Invalid roll number');
      return;
    }

    if (!currentPresentStudents.includes(formatted)) {
      setCurrentPresentStudents([...currentPresentStudents, formatted].sort((a, b) => parseInt(a) - parseInt(b)));
    }

    setManualRollInput('');
  };

  const toggleStudentPresent = (rollNo: string) => {
    if (currentPresentStudents.includes(rollNo)) {
      setCurrentPresentStudents(currentPresentStudents.filter(r => r !== rollNo));
    } else {
      setCurrentPresentStudents([...currentPresentStudents, rollNo].sort((a, b) => parseInt(a) - parseInt(b)));
    }
  };

  const handleSaveAttendance = () => {
    if (!selectedSubjectId) {
      alert('Please select a subject');
      return;
    }

    if (currentPresentStudents.length === 0) {
      alert('No students marked present');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      subjectId: selectedSubjectId,
      date: currentDate,
      time: currentTime,
      presentStudents: [...currentPresentStudents].sort((a, b) => parseInt(a) - parseInt(b))
    };

    const updatedRecords = [...records, newRecord];
    saveRecords(updatedRecords);
    setSelectedRecordId(newRecord.id);

    alert(`Attendance saved! ${currentPresentStudents.length} students marked present.`);
  };

  const handleDeleteRecord = (id: string) => {
    if (!confirm('Delete this attendance record?')) return;

    saveRecords(records.filter(r => r.id !== id));
    if (selectedRecordId === id) {
      setSelectedRecordId('');
    }
  };

  // Download
  const handleDownload = async () => {
    if (!slipRef.current || !selectedRecordId) return;

    try {
      const dataUrl = await toJpeg(slipRef.current, {
        backgroundColor: bgColor,
        quality: 0.95,
        fontEmbedCSS: ''
      });

      const link = document.createElement('a');
      const record = records.find(r => r.id === selectedRecordId);
      const subject = subjects.find(s => s.id === record?.subjectId);
      link.download = `attendance-${subject?.subjectCode || 'slip'}-${record?.date}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
      alert('Download failed. See console for details.');
    }
  };

  // Get filtered data
  const subjectStudents = students.filter(s => s.subjectId === selectedSubjectId);
  const filteredRecords = selectedSubjectId ? records.filter(r => r.subjectId === selectedSubjectId) : [];
  const selectedRecord = records.find(r => r.id === selectedRecordId);
  const selectedSubject = subjects.find(s => s.id === (selectedRecord?.subjectId || selectedSubjectId));

  // Display students (sorted)
  const displayStudents = selectedRecord
    ? [...selectedRecord.presentStudents].sort((a, b) => parseInt(a) - parseInt(b))
    : [...currentPresentStudents].sort((a, b) => parseInt(a) - parseInt(b));

  // Reset current attendance when subject changes
  useEffect(() => {
    setCurrentPresentStudents([]);
    setSelectedRecordId('');
  }, [selectedSubjectId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Slip Maker</h1>
          <p className="text-slate-600 mt-1">Create and manage attendance records</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="customize">Customize</TabsTrigger>
                </TabsList>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-4 mt-4">
                  {/* Subject Selection */}
                  <div className="space-y-2">
                    <Label>Select Subject</Label>
                    <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.subject} ({s.subjectCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Manual Roll Number Input */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Roll Number
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={manualRollInput}
                        onChange={(e) => setManualRollInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddManualRoll()}
                        placeholder="Enter roll number"
                        disabled={!selectedSubjectId}
                      />
                      <Button
                        onClick={handleAddManualRoll}
                        disabled={!selectedSubjectId}
                        size="icon"
                        variant="secondary"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {currentPresentStudents.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentPresentStudents.map((roll) => (
                          <div
                            key={roll}
                            className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                          >
                            <span className="font-mono font-semibold">{roll}</span>
                            <button
                              onClick={() => setCurrentPresentStudents(currentPresentStudents.filter(r => r !== roll))}
                              className="hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Attendance Button */}
                  <Button
                    onClick={handleSaveAttendance}
                    className="w-full bg-primary font-semibold"
                    disabled={!selectedSubjectId || currentPresentStudents.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Save Attendance
                  </Button>

                  {/* Saved Records */}
                  {filteredRecords.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Saved Records
                      </Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredRecords.map(record => (
                          <div
                            key={record.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedRecordId === record.id ? 'bg-primary text-white' : 'bg-slate-50 hover:bg-slate-100'}`}
                            onClick={() => setSelectedRecordId(record.id)}
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{record.date}</p>
                              <p className={`text-xs ${selectedRecordId === record.id ? 'text-white/80' : 'text-slate-600'}`}>
                                {record.time} • {record.presentStudents.length} present
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record.id);
                              }}
                            >
                              <Trash2 className={`h-4 w-4 ${selectedRecordId === record.id ? 'text-white' : 'text-red-500'}`} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Customize Tab */}
                <TabsContent value="customize" className="space-y-6 mt-4">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Font Size
                      </Label>
                      <span className="text-sm text-slate-600">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={([v]) => setFontSize(v)}
                      min={10}
                      max={24}
                      step={1}
                    />
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>

                  {/* Global Settings */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Slip Headers
                    </Label>
                    <div className="space-y-2">
                      <Input
                        value={globalSettings.heading}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, heading: e.target.value })}
                        placeholder="Main heading"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={globalSettings.subheading}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, subheading: e.target.value })}
                        placeholder="Subheading"
                      />
                    </div>
                    <Button onClick={() => saveGlobalSettings(globalSettings)} className="w-full" variant="outline">
                      Save Headers
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Middle Panel - Manage Subjects & Students */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Manage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="subjects" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="subjects">Subjects</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="space-y-4 mt-4">
                  {subjects.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No subjects added yet</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {subjects.map(subject => (
                        <div key={subject.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{subject.subject}</p>
                            <p className="text-xs text-slate-600">{subject.subjectCode} • {subject.branch} Sem {subject.semester}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Dialog open={isSubjectFormOpen} onOpenChange={setIsSubjectFormOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Subject Name</Label>
                          <Input
                            value={subjectForm.subject}
                            onChange={(e) => setSubjectForm({ ...subjectForm, subject: e.target.value })}
                            placeholder="e.g., Data Structures"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subject Code</Label>
                          <Input
                            value={subjectForm.subjectCode}
                            onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                            placeholder="e.g., CS201"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Branch</Label>
                            <Input
                              value={subjectForm.branch}
                              onChange={(e) => setSubjectForm({ ...subjectForm, branch: e.target.value })}
                              placeholder="e.g., CSE"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Semester</Label>
                            <Input
                              value={subjectForm.semester}
                              onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                              placeholder="e.g., 3"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Total Students</Label>
                          <Input
                            type="number"
                            value={subjectForm.totalStudents || ''}
                            onChange={(e) => setSubjectForm({ ...subjectForm, totalStudents: parseInt(e.target.value) || 0 })}
                            placeholder="e.g., 60"
                          />
                        </div>
                        <Button onClick={handleAddSubject} className="w-full bg-primary">
                          Add Subject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-4 mt-4">
                  {!selectedSubjectId ? (
                    <p className="text-center text-slate-500 py-4">Select a subject first</p>
                  ) : subjectStudents.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No students added yet</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {subjectStudents
                        .sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo))
                        .map((student) => {
                          const isPresent = currentPresentStudents.includes(student.rollNo);
                          return (
                            <div
                              key={student.rollNo}
                              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isPresent ? 'bg-primary text-white' : 'bg-slate-50'}`}
                            >
                              <span className="font-mono font-semibold">{student.rollNo}</span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={isPresent ? "secondary" : "default"}
                                  onClick={() => toggleStudentPresent(student.rollNo)}
                                  className={isPresent ? '' : 'bg-primary'}
                                >
                                  {isPresent ? 'Remove' : 'Present'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteStudent(student.rollNo)}
                                >
                                  <Trash2 className={`h-4 w-4 ${isPresent ? 'text-white' : 'text-red-500'}`} />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={!selectedSubjectId}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Student</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Roll Number</Label>
                          <Input
                            value={newRollNo}
                            onChange={(e) => setNewRollNo(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                            placeholder="e.g., 1, 12, 901"
                          />
                          <p className="text-xs text-slate-500">
                            1-100 will be formatted as 01-100. 101+ stays as is.
                          </p>
                        </div>
                        <Button onClick={handleAddStudent} className="w-full bg-primary">
                          Add Student
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Right Panel - Preview */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Preview
              </CardTitle>
              <Button
                onClick={handleDownload}
                disabled={!selectedRecordId}
                className="bg-primary font-semibold"
              >
                <Download className="mr-2 h-4 w-4" />
                Download JPG
              </Button>
            </CardHeader>
            <CardContent>
              <div
                ref={slipRef}
                className="p-8 rounded-lg border border-slate-200 min-h-[500px]"
                style={{ backgroundColor: bgColor, color: textColor, fontSize: `${fontSize}px` }}
              >
                {(selectedRecord || (selectedSubject && displayStudents.length > 0)) ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center" style={{ borderColor: textColor + '33' }}>
                      <h2 className="font-bold" style={{ fontSize: `${fontSize * 1.5}px` }}>
                        {globalSettings.heading}
                      </h2>
                      <p className="mt-2 opacity-75">{globalSettings.subheading}</p>
                    </div>
<div className="flex justify-between border-b pb-4" style={{ borderColor: textColor + '33' }}>
                      <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {selectedRecord?.date || currentDate}
                      </p>
                      <p>
                        <span className="font-semibold">Time:</span>{' '}
                        {selectedRecord?.time || currentTime}
                      </p>
                    </div>
                    {/* Subject Info */}
                    <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                        <p className="font-semibold">Subject</p>
                        <p>{selectedSubject?.subject}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Subject Code</p>
                        <p>{selectedSubject?.subjectCode}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Branch</p>
                        <p>{selectedSubject?.branch}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Semester</p>
                        <p>{selectedSubject?.semester}</p>
                      </div>
                    </div>

                    

                    {/* Attendance List */}
                    <div>
                      <p className="font-semibold mb-2">
                        Present Students ({displayStudents.length})
                      </p>
                       <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {displayStudents.map((regNo, i) => (
                          <div 
                            key={i}
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold"
                            style={{ 
                              backgroundColor: textColor + '15',
                              border: `1px solid ${textColor}33`
                            }}
                          >
                            {regNo}
                          </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                      className="text-center text-xs opacity-70 border-t pt-4"
                      style={{ borderColor: textColor + '33' }}
                    >
                      Generated using AttendEase
                    </div>
                  </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No attendance data to preview
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
