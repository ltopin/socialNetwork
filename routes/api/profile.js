const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load validation
const validadeProfileImput = require("../../validation/profile");
const validadeExperienceImput = require("../../validation/experience");
const validadeEducationImput = require("../../validation/education");

//load profile models
const Profile = require("../../models/Profile");

//load User profile

const User = require("../../models/User");

//@Route    GET /api/profile/teste
//@desc     Test Profile route
//@access   Public
router.get("/teste", (req, res) =>
  res.json({ msg: "Funcionou a rota Profile  !!" })
);

//@Route    GET /api/profile
//@desc     Get current users profile
//@access   Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "não existe perfil associado a este usuário";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@Route    GET /api/profile/all
//@desc     Get all profiles
//@access   Public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "Perfil não encontrado";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "Perfil não encontrado" }));
});

//@Route    GET /api/profile/handle/:handle
//@desc     Get profile by handle
//@access   Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Não existe perfil assosciado a este usuário";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(errors));
});

//@Route    GET /api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Não existe perfil assossiado a este usuário";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: "Não existe perfil assossiado a este usuário" })
    );
});

//@Route    POST /api/profile
//@desc     CREATE user profile
//@access   Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validadeProfileImput(req.body);

    //check validation
    if (!isValid) {
      //return qualquer erro com status 400

      return res.status(400).json(errors);
    }

    //get fields

    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //Social

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create

        //check if handle exists

        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "that handle already exists";
            res.status(400).json(errors);
          }

          //save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//@Route    POST /api/profile/experience
//@desc     ADD experience to profile
//@access   Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validadeExperienceImput(req.body);

    //check validation
    if (!isValid) {
      //return qualquer erro com status 400

      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //add to exp array
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
  }
);
//@Route    POST /api/profile/education
//@desc     ADD education to profile
//@access   Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validadeEducationImput(req.body);

    //check validation
    if (!isValid) {
      //return qualquer erro com status 400

      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        field: req.body.field,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //add to exp array
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);

//@Route    DELETE /api/profile/experience/:exp_id
//@desc     Delete experience from profile
//@access   Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index

        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        //Splice out of array

        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@Route    DELETE /api/profile/education/:edu_id
//@desc     Delete education from profile
//@access   Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index

        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        //Splice out of array

        profile.education.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@Route    DELETE /api/profile
//@desc     Delete user and profile
//@access   Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndDelete({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);
module.exports = router;
