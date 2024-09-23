const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    Reg: { type: String, unique: true, sparse: true }, // Add sparse if Reg can be null
  });
  