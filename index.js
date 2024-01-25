const express = require('express')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser'); // เพิ่ม body-parser

const employeeData = require('./employee.json'); // นำเข้าข้อมูลพนักงานจากไฟล์ employee.json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// เพิ่มเส้นทางใหม่โดยใช้พารามิเตอร์สำหรับ ID
app.get('/employee/:id', (req, res) => {
  const employeeId = parseInt(req.params.id); // ดึง ID ที่ส่งมาจาก request
  const employee = employeeData.employee.find(emp => emp.id === employeeId); // ค้นหาพนักงาน ID

  if (employee) {
    res.json(employee); // ส่งข้อมูลของพนักงานที่พบ
  } else {
    res.status(404).json({ message: 'Employee not found' }); // ส่งข้อความว่าพนักงานไม่พบเมื่อไม่พบ ID ที่ร้องขอ
  }
});

app.post('/employees', (req, res) => {
  // ดึงไอดีสุดท้ายออกมาจาก employeeData
  const lastEmployeeId = employeeData.employee.length > 0 ? employeeData.employee[employeeData.employee.length - 1].id : 0;
  
  // กำหนดไอดีใหม่สำหรับพนักงานที่จะเพิ่มเข้าไป
  const newEmployeeId = lastEmployeeId + 1;

  // รับข้อมูลที่ส่งมาจาก request เพื่อสร้างพนักงานใหม่
  const newEmployee = req.body;

  // เพิ่มไอดีใหม่ในข้อมูลพนักงานที่จะเพิ่มเข้าไป
  newEmployee.id = newEmployeeId;

  // เพิ่มพนักงานใหม่ลงใน employeeData
  employeeData.employee.push(newEmployee);

  // บันทึกข้อมูลลงในไฟล์ employee.json (ต้องการการจัดการไฟล์แบบอื่น เช่น fs)
  // ...

  res.json(newEmployee); // ส่งข้อมูลของพนักงานใหม่ที่ถูกเพิ่ม
});

app.get('/', (req, res) => {
  res.json(employeeData.employee);
});

app.post('/employees', (req, res) => {
  // รับข้อมูลที่ส่งมาจาก request เพื่อสร้างพนักงานใหม่
  const newEmployee = req.body; // ตัวอย่างการรับข้อมูล body (ต้องใช้ body-parser middleware)

  // เพิ่มพนักงานใหม่ลงใน employeeData
  employeeData.employee.push(newEmployee);

  // บันทึกข้อมูลลงในไฟล์ employee.json (ต้องการการจัดการไฟล์แบบอื่น เช่น fs)
  // ...

  res.json(newEmployee); // ส่งข้อมูลของพนักงานใหม่ที่ถูกเพิ่ม
});

app.put('/employees/:id', (req, res) => {
  const employeeId = parseInt(req.params.id); // ดึง ID ที่ต้องการแก้ไขจาก request
  const updatedEmployee = req.body; // ข้อมูลใหม่ที่จะใช้ในการแก้ไข

  // ค้นหาพนักงานที่ต้องการแก้ไขจาก employeeData
  const employeeToUpdate = employeeData.employee.find(emp => emp.id === employeeId);

  if (employeeToUpdate) {
    // ทำการอัปเดตข้อมูลพนักงาน
    Object.assign(employeeToUpdate, updatedEmployee);

    // บันทึกข้อมูลลงในไฟล์ employee.json (ต้องการการจัดการไฟล์แบบอื่น เช่น fs)
    // ...

    res.json(employeeToUpdate); // ส่งข้อมูลของพนักงานที่ถูกอัปเดต
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.delete('/employees/:id', (req, res) => {
  const employeeId = parseInt(req.params.id); // ดึง ID ที่ต้องการลบจาก request

  // ค้นหาพนักงานที่ต้องการลบจาก employeeData
  const employeeIndex = employeeData.employee.findIndex(emp => emp.id === employeeId);

  if (employeeIndex !== -1) {
    // ทำการลบข้อมูลพนักงานออกจาก employeeData
    employeeData.employee.splice(employeeIndex, 1);

    // บันทึกข้อมูลลงในไฟล์ employee.json (ต้องการการจัดการไฟล์แบบอื่น เช่น fs)
    // ...

    res.json({ message: 'Employee deleted' });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
