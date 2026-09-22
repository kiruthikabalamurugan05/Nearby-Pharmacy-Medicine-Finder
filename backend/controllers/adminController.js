const User = require('../Models/User');
const Pharmacy = require('../Models/Pharmacy');
const Medicine = require('../Models/Medicine');

// ================= ADMIN STATS =================

exports.getAdminStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({
      role: 'customer'
    });

    const totalPharmacies = await Pharmacy.countDocuments();

    const activePharmacies = await Pharmacy.countDocuments({
      status: 'approved'
    });

    const pendingPharmacies = await Pharmacy.countDocuments({
      status: 'pending'
    });

    const totalMedicines = await Medicine.countDocuments();

    res.status(200).json({
      totalCustomers,
      totalPharmacies,
      activePharmacies,
      pendingPharmacies,
      totalMedicines
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ================= GET ALL CUSTOMERS =================

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: 'customer'
    }).select('-password');

    res.status(200).json(customers);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ================= GET ALL PHARMACIES =================

exports.getAllPharmaciesAdmin = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find()
      .populate('owner', 'name email phone location status');

    res.status(200).json(pharmacies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ================= GET PENDING PHARMACIES =================

exports.getPendingPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({
      status: 'pending'
    })
      .populate(
        'owner',
        'name email phone location status'
      );

    res.status(200).json(pharmacies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ================= APPROVE / REJECT PHARMACY =================

exports.verifyPharmacy = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    // Check status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be approved or rejected'
      });
    }

    // Find pharmacy
    const pharmacy = await Pharmacy.findById(id);

    if (!pharmacy) {
      return res.status(404).json({
        message: 'Pharmacy not found'
      });
    }

    // Only pending pharmacies can be verified
    if (pharmacy.status !== 'pending') {
      return res.status(400).json({
        message: `Pharmacy is already ${pharmacy.status}`
      });
    }

    // ================= UPDATE PHARMACY =================

    pharmacy.status = status;

    await pharmacy.save();


    // ================= UPDATE USER =================

    const user = await User.findById(pharmacy.owner);

    if (!user) {
      return res.status(404).json({
        message: 'Pharmacy owner account not found'
      });
    }

    user.status = status;

    await user.save();


    // ================= RESPONSE =================

    res.status(200).json({
      message:
        status === 'approved'
          ? 'Pharmacy approved successfully'
          : 'Pharmacy rejected successfully',

      pharmacy: {
        id: pharmacy._id,
        name: pharmacy.name,
        status: pharmacy.status
      },

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ================= DELETE USER =================

exports.deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }


    // If pharmacy owner,
    // delete linked pharmacy
    if (user.role === 'pharmacy') {

      await Pharmacy.findOneAndDelete({
        owner: user._id
      });

    }


    // Delete user
    await User.findByIdAndDelete(req.params.id);


    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};