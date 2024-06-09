import { useRef, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { Button, TextField } from "@mui/material";

export default function ProfilePage() {
  interface FormDataState {
    [key: string]: string;
  }
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePer, setImagePer] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };
  const dispatch = useDispatch();
  interface RootState {
    users: {
      currentUser: {
        userId: string;
        profilePic: string;
        email: string;
        username: string;
        _id: string;
      };
    };
  }
  const { currentUser } = useSelector((state: RootState) => state.users);
  console.log(currentUser);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePer(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePic: downloadURL })
        );
      }
    );
  };
  const handleClick = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };
  return (
    <div className="container mx-auto py-10 flex-1 px-4">
      <div className="flex items-center justify-center mb-10">
        <input
          id="profilePic"
          type="file"
          accept="image/*"
          ref={filePickerRef}
          hidden
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setImage(files[0]);
              handleChange;
            }
          }}
        />
        <Avatar
          className="cursor-pointer"
          src={formData.profilePic || currentUser.profilePic}
          onClick={() => filePickerRef.current?.click()}
          sx={{ width: 72, height: 72 }}
        />
      </div>
      <div className="flex flex-col gap-y-3">
        <TextField
          label="Username"
          type="text"
          variant="filled"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          type="email"
          variant="filled"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button onClick={handleClick} type="submit" variant="contained">
          Update
        </Button>
      </div>

      <p className="text-sm text-gray-800">
        {imageError ? (
          <span className="text-red-700">Error uploading image</span>
        ) : imagePer > 0 && imagePer < 100 ? (
          <span className="text-slate-700">{`Uploading: ${imagePer}%`}</span>
        ) : imagePer === 100 ? (
          <span className="text-gray-700">Image uploaded successfully</span>
        ) : (
          ""
        )}
      </p>
      <div></div>

      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully!"}
      </p>
    </div>
  );
}
