const Medicine = require('../Models/Medicine');
const Pharmacy = require('../Models/Pharmacy');
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('pharmacyId', 'name address phone location');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};
    const medicines = await Medicine.find(query).populate('pharmacyId', 'name address phone location openingTime closingTime');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicinesByPharmacy = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacyId: req.params.pharmacyId });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMedicine = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy missing' });

    const medicine = await Medicine.create({ ...req.body, pharmacyId: pharmacy._id });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};