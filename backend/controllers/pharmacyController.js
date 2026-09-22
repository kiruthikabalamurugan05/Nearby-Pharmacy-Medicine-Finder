const Pharmacy = require('../Models/Pharmacy');
const User = require('../Models/User');

// 1. Pharmacy registration
// Pharmacy submits details + licence for Admin approval
const registerPharmacy = async (req, res) => {
  try {

    // Check if licence was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: 'Pharmacy licence is required'
      });
    }

    const {
      name,
      email,
      phone,
      password,
      city
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Create pharmacy user as PENDING
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'pharmacy',
      status: 'pending',
      location: city
    });

    // Create pharmacy registration
    const pharmacy = await Pharmacy.create({
      name,
      licenseNumber: 'Pending Verification',
      address: city,
      phone,
      owner: user._id,
      status: 'pending',
      licenseDocument: req.file.path
    });

    res.status(201).json({
      message: 'Pharmacy registration submitted for admin approval',
      pharmacyId: pharmacy._id
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// 2. Public: Get only APPROVED pharmacies
const getApprovedPharmacies = async (req, res) => {
  try {

    const pharmacies = await Pharmacy.find({
      status: 'approved'
    });

    res.status(200).json(pharmacies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// 3. Admin Only: View PENDING pharmacy registrations
const getPendingPharmacies = async (req, res) => {
  try {

    const pending = await Pharmacy.find({
      status: 'pending'
    }).populate('owner', 'name email phone');

    res.status(200).json(pending);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// 4. Admin Only: Approve or Reject pharmacy
const verifyPharmacy = async (req, res) => {

  const { pharmacyId } = req.params;
  const { status } = req.body;

  try {

    // Only allow approved or rejected
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be approved or rejected'
      });
    }

    // Find pharmacy
    const pharmacy = await Pharmacy.findById(pharmacyId);

    if (!pharmacy) {
      return res.status(404).json({
        message: 'Pharmacy not found'
      });
    }

    // Update pharmacy status
    pharmacy.status = status;
    await pharmacy.save();

    // Update owner User status
    await User.findByIdAndUpdate(
      pharmacy.owner,
      { status: status }
    );

    res.status(200).json({
      message: `Pharmacy is now ${status}`,
      pharmacy
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


module.exports = {
  registerPharmacy,
  getApprovedPharmacies,
  getPendingPharmacies,
  verifyPharmacy
};