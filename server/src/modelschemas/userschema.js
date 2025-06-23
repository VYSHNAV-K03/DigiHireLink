const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    verfication: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
    },

    tagline: {
      type: String,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
    },
    profile: {
      type: String,
    },
    resume: {
      type: String,
    },
    Role: {
      type: Number,
      default: 0,
    },
    Train: {
      type: Boolean,
      default: false,
    },
    current_status: {
      type: Number,
      default: 0, // 0 = Not employed, 1 = Employed
    },
    company_name: {
      type: String,
      default: null, // Stores current company name if employed
    },
    company_id: {
      type: String,
      default: null, // Stores current company ID if employed
    },
    start_date: {
      type: Date,
      default: null, // Stores start date if employed
    },
    recruitments: [
      {
        company_name: String,
        company_id: String,
      },
    ],
    experience: [
      {
        company_name: String,
        company_id: String,
        start_date: Date,
        end_date: Date,
      },
    ],

    education: [
      {
        institution_name: {
          type: String,
          default: "",
        },
        year: {
          type: Number,
        },
        cgpa: {
          type: Number,
        },
        back_papers: {
          type: Number,
        },
        branch: {
          type: String,
          default: "",
        },
        certificate: {
          type: String,
          default: "",
        },
      },
    ],
    coding: [
      {
        nodev_desc: {
          type: String,
        },
        dev_desc: {
          type: String,
        },
        dev_status: {
          type: String,
        },
        languages: [
          {
            language_name: {
              type: String,
              default: "",
            },
            language_level: {
              type: String,
              default: "",
            },
          },
        ],
        communication_languages: [
          {
            language_name: {
              type: String,
              default: "",
            },
          },
        ],

        links: [
          {
            github: {
              type: String,
              default: "",
            },
            linkedin: {
              type: String,
              default: "",
            },
          },
        ],
      },
    ],
    placement: [
      {
        company_id: {
          type: String,
        },
        company_name: {
          type: String,
          default: "",
        },
        level_of_placement: {
          type: Number,
        },
        current_status: {
          type: Number,
        },
        response: {
          type: Number,
        },
      },
    ],
    notifications: [
      {
        response: {
          type: Boolean,
          default: false,
        },
        viewed: {
          type: Boolean,
          default: false,
        },
        resignReason: {
          type: String,
          default: "",
        },
        company_name: {
          type: String,
          default: "",
        },
        company_id: {
          type: String,
          default: "",
        },
        deadline: { type: String, default: "" },
        role: {
          type: Number,
        },
        click_event: {
          type: Boolean,
        },
        level_of_placement: {
          type: Number,
        },
        date: {
          type: String,
        },
        type_exam: {
          type: String,
        },
        mode: {
          type: String,
        },
        subject: {
          type: String,
        },
        send_date: {
          type: String,
        },
        requirements: [
          {
            laptop: {
              type: Boolean,
            },
            internet: {
              type: Boolean,
            },
            more: {
              type: String,
            },
          },
        ],
      },
    ],
    notifications: [
      {
        response: {
          type: Boolean,
          default: false,
        },
        viewed: {
          type: Boolean,
          default: false,
        },
        resignReason: {
          type: String,
          default: "",
        },
        company_name: {
          type: String,
          default: "",
        },
        company_id: {
          type: String,
          default: "",
        },
        deadline: { type: String, default: "" },
        role: {
          type: Number,
        },
        click_event: {
          type: Boolean,
        },
        level_of_placement: {
          type: Number,
        },
        date: {
          type: String,
        },
        type_exam: {
          type: String,
        },
        mode: {
          type: String,
        },
        subject: {
          type: String,
        },
        send_date: {
          type: String,
        },
        requirements: [
          {
            laptop: {
              type: Boolean,
            },
            internet: {
              type: Boolean,
            },
            more: {
              type: String,
            },
          },
        ],
      },
    ],
    notifications_admin: [
      {
        user_id: {
          type: String,
        },
        name: {
          type: String,
        },
        role: {
          type: Number,
        },
        response: {
          type: Boolean,
        },
        send_date: {
          type: String,
        },
      },
    ],
    mails: [
      {
        company_id: {
          type: String,
        },
        name: {
          type: String,
        },
        subject: {
          type: String,
        },
        response: {
          type: Boolean,
        },
      },
    ],

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

userschema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
      expiresIn: "50m",
    });
    console.log(token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log("auth", err);
  }
};

const USER = mongoose.model("USER", userschema);

module.exports = USER;
