'use client'
import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import Image from 'next/image';
import logo from './logo.png';

const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Optional"
];

const initialCourses = {
  "Semester 1": [
    { name: "Learning methodology P", credits: 1 },
    { name: "Basic mathematics P", credits: 4 },
    { name: "Computer systems L+P", credits: 5 },
    { name: "Programming L+P", credits: 6 },
    { name: "Imperative programming L+P", credits: 5 },
    { name: "Functional programming L+P", credits: 5 },
    { name: "Business fundamentals L+P", credits: 3 }
  ],
  "Semester 2": [
    { name: "Analysis I P", credits: 3 },
    { name: "Analysis I L", credits: 2 },
    { name: "Discrete mathematics I P", credits: 3 },
    { name: "Discrete mathematics I L", credits: 2 },
    { name: "Algorithms and data structures I P", credits: 3 },
    { name: "Algorithms and data structures I L", credits: 2 },
    { name: "Web development L+P", credits: 3 },
    { name: "Object-oriented programming L+P", credits: 6 },
    { name: "Programming languages L+P", credits: 6 }
  ],
  "Semester 3": [
    { name: "Analysis II P", credits: 3 },
    { name: "Analysis II L", credits: 2 },
    { name: "Web programming L+P", credits: 4 },
    { name: "Programming technology L+P", credits: 5 },
    { name: "Algorithms and data structures II P", credits: 3 },
    { name: "Algorithms and data structures II L", credits: 2 },
    { name: "Application of discrete models P", credits: 3 }
  ],
  "Semester 4": [
    { name: "Operating systems L+P", credits: 3 },
    { name: "Databases I P", credits: 2 },
    { name: "Databases I L", credits: 2 },
    { name: "Software technology L+P", credits: 5 },
    { name: "Fundamentals of theory of computation I P", credits: 3 },
    { name: "Fundamentals of theory of computation I L", credits: 2 },
    { name: "Numerical methods P", credits: 3 },
    { name: "Numerical methods L", credits: 2 }
  ],
  "Semester 5": [
    { name: "Concurrent programming L+P", credits: 3 },
    { name: "Telecommunication networks P", credits: 3 },
    { name: "Telecommunication networks L", credits: 2 },
    { name: "Fundamentals of theory of computation II P", credits: 3 },
    { name: "Fundamentals of theory of computation II L", credits: 2 },
    { name: "Artificial intelligence L", credits: 3 },
    { name: "Probability and statistics P", credits: 3 },
    { name: "Databases II P", credits: 3 },
    { name: "Databases II L", credits: 2 }
  ],
  "Semester 6": [
    { name: "Diploma work consultations", credits: 20 }
  ],
  "Optional": [
    { name: "Elective Course 1", credits: 3 },
    { name: "Elective Course 2", credits: 3 }
  ]
};

export default function GPAcalculator() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', grade: '', credits: '', semester: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [totalGPA, setTotalGPA] = useState(0);
  const [totalCCI, setTotalCCI] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('All');

  const addOrUpdateCourse = async (e) => {
    e.preventDefault();
    if (newCourse.name !== '' && newCourse.grade !== '' && newCourse.credits !== '' && newCourse.semester !== '') {
      const existingCourse = courses.find(course => 
        course.name === newCourse.name && course.semester === newCourse.semester
      );
      if (existingCourse && !editingCourse) {
        alert("This course already exists in the selected semester.");
        return;
      }

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), {
          name: newCourse.name.trim(),
          grade: parseFloat(newCourse.grade),
          credits: parseFloat(newCourse.credits),
          semester: newCourse.semester
        });
        setEditingCourse(null);
      } else {
        await addDoc(collection(db, 'courses'), {
          name: newCourse.name.trim(),
          grade: parseFloat(newCourse.grade),
          credits: parseFloat(newCourse.credits),
          semester: newCourse.semester
        });
      }
      setNewCourse({ name: '', grade: '', credits: '', semester: '' });
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setNewCourse({ name: course.name, grade: course.grade.toString(), credits: course.credits.toString(), semester: course.semester });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'courses', id));
  };

  useEffect(() => {
    const q = query(collection(db, 'courses'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let coursesArr = [];
      querySnapshot.forEach((doc) => {
        coursesArr.push({ ...doc.data(), id: doc.id });
      });
      setCourses(coursesArr);
      calculateGPAandCCI(coursesArr, selectedSemester);
    });
    return () => unsubscribe();
  }, [selectedSemester]);

  const calculateGPAandCCI = (courses, semester) => {
    const filteredCourses = semester === 'All' ? courses : courses.filter(course => course.semester === semester);
    const totalCredits = filteredCourses.reduce((sum, course) => sum + parseFloat(course.credits), 0);
    const weightedSum = filteredCourses.reduce((sum, course) => sum + (parseFloat(course.grade) * parseFloat(course.credits)), 0);
    const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

    const creditsObtained = courses.reduce((sum, course) => sum + parseFloat(course.credits), 0);
    const weightedGradeSum = courses.reduce((sum, course) => {
      const grade = parseFloat(course.grade);
      const credits = parseFloat(course.credits);
      return sum + (grade * credits);
    }, 0);
    const failedCredits = filteredCourses.reduce((sum, course) => {
      return sum + (course.grade <= 1 ? parseFloat(course.credits) : 0);
    }, 0);
    const cci = creditsObtained > 0 ? (((weightedGradeSum / 30) * (creditsObtained / totalCredits)) - (failedCredits / 30)).toFixed(2) : 0;

    setTotalGPA(gpa);
    setTotalCCI(cci);
  };

  const handleShareText = () => {
    const courseDetails = courses.map(course => 
      `Course: ${course.name}, Grade: ${course.grade}, Credits: ${course.credits}, Semester: ${course.semester}`
    ).join('\n');
    const text = `Total GPA: ${totalGPA}\nTotal CCI: ${totalCCI}\n\nCourses:\n${courseDetails}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("GPA and CCI details copied to clipboard!");
    });
  };

  const handleShareImage = () => {
    toPng(document.getElementById('gpa-cci-details'))
      .then((dataUrl) => {
        download(dataUrl, 'gpa-cci-details.png');
      })
      .catch((err) => {
        console.error('Failed to capture image', err);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div id="gpa-cci-details" className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <Image src={logo} alt="Logo" width={50} height={50} />
          <h1 className="text-3xl font-semibold text-center ml-4">ELTE GPA & CCI Calculator</h1>
        </div>
        <form className="space-y-4 mb-6" onSubmit={addOrUpdateCourse}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <input
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="p-3 border border-gray-300 rounded-md shadow-sm"
              type="text"
              placeholder='Course Name'
              list="courseNames"
            />
            <datalist id="courseNames">
              {Object.keys(initialCourses).map((semester) => 
                initialCourses[semester].map((course, index) => 
                  <option key={`${semester}-${index}`} value={course.name}>{course.name}</option>
                )
              )}
            </datalist>
            <input
              value={newCourse.grade}
              onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
              className="p-3 border border-gray-300 rounded-md shadow-sm"
              type="number"
              step="0.01"
              placeholder='Grade'
            />
            <input
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
              className="p-3 border border-gray-300 rounded-md shadow-sm"
              type="number"
              step="0.01"
              placeholder='Credits'
            />
            <select
              value={newCourse.semester}
              onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
              className="p-3 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-lg"
          >
            {editingCourse ? 'Update Course' : 'Add Course'}
          </button>
        </form>
        <div className="mb-6">
          <label className="block text-gray-700">Select Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              calculateGPAandCCI(courses, e.target.value);
            }}
            className="p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="All">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
        <ul className="space-y-4">
          {courses
            .filter(course => selectedSemester === 'All' || course.semester === selectedSemester)
            .map((course) => (
              <li key={course.id} className='bg-gray-200 p-4 rounded-md shadow-md flex justify-between items-center'>
                <div className='flex-grow'>
                  <h2 className='text-lg font-semibold'>{course.name}</h2>
                  <p className='text-gray-600'>Grade: {parseFloat(course.grade).toFixed(2)}</p>
                  <p className='text-gray-600'>Credits: {parseFloat(course.credits).toFixed(2)}</p>
                  <p className='text-gray-600'>Semester: {course.semester}</p>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handleEdit(course)}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
        </ul>
        <div className='mt-6 flex justify-between text-xl font-semibold'>
          <span>Total GPA</span>
          <span>{totalGPA}</span>
        </div>
        <div className='mt-6 flex justify-between text-xl font-semibold'>
          <span>Total CCI</span>
          <span>{totalCCI}</span>
        </div>
      </div>
      <div className='mt-6 flex space-x-4'>
        <button
          onClick={handleShareText}
          className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md'
        >
          Share via Text
        </button>
        <button
          onClick={handleShareImage}
          className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md'
        >
          Share as Image
        </button>
      </div>
    </main>
  );
}
