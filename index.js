const express = require('express');
const cors = require('cors');
const app = express();
const employeeData = require('./employee.json');

app.use(express.json());
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
  const lastEmployeeId = employeeData.employee.length > 0 ? employeeData.employee[employeeData.employee.length - 1].id : 0;
  const newEmployeeId = lastEmployeeId + 1;

  const newEmployee = req.body;
  newEmployee.id = newEmployeeId;

  employeeData.employee.push(newEmployee);

  // บันทึกข้อมูลลงในไฟล์ employee.json (ต้องการการจัดการไฟล์แบบอื่น เช่น fs)
  // ...

  res.json(newEmployee); // ส่งข้อมูลของพนักงานใหม่ที่ถูกเพิ่ม
});

app.get('/employees', (req, res) => {
  res.json(employeeData.employee);
});

app.put('/employees/:id', (req, res) => {
  const employeeId = parseInt(req.params.id);
  const updatedEmployee = req.body;

  const employeeToUpdate = employeeData.employee.find(emp => emp.id === employeeId);

  if (employeeToUpdate) {
    // ทำการอัปเดตข้อมูลพนักงาน
    Object.assign(employeeToUpdate, updatedEmployee);

    // บันทึกข้อมูลลงในไฟล์ employee.json (ต้องการการจัดการไฟล์แบบอื่น เช่น fs)
    // ...

    res.json(employeeToUpdate);
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