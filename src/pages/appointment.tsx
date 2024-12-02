import { useEffect, useState } from "react";
import { db, auth } from "./fireBaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import Navbar from "./components/Navbar";
import { onAuthStateChanged } from "firebase/auth";

const Appointment = () => {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [petNames, setPetNames] = useState([]); // For dropdown
  const [isNewPet, setIsNewPet] = useState(false); // To track if "Other" is selected

  const breeds = [
    { name: "Golden Retriever", image: '/images/golden-retriever.png'},
    { name: "French Bulldog", image: '/images/frenchie.png'},
    { name: "German Shepherd", image: '/images/german-shepherd.png'},
    { name: "Beagle", image: '/images/beagle.png'},
    { name: "Gray Tabby", image: '/images/gray-tabby.png'},
    { name: "Orange Tabby", image: '/images/orange-tabby.png'},
    { name: "Persian Cat", image: '/images/persian-cat.png'},
    { name: "Siamese Cat", image: '/images/siamese-cat.png'}
  ];

  const getBreedImage = (breedName) => {
    const breed = breeds.find(b => b.name === breedName);
    return breed ? breed.image : '';
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch existing pet names
  const fetchPetNames = async () => {
    if (!user) return;

    const petData = []; // Array to store pet objects
    const petWeightQuery = await getDocs(collection(db, "petWeights"));
    const appointmentQuery = await getDocs(collection(db, "appointmentInfo"));

    petWeightQuery.forEach((doc) => {
      if (doc.data().userId === user.uid) {
        petData.push({ name: doc.data().petName, breed: doc.data().breed || "" });
      }
    });

    appointmentQuery.forEach((doc) => {
      if (doc.data().userId === user.uid) {
        // Avoid duplicates by checking if the pet is already added
        if (!petData.some((pet) => pet.name === doc.data().petName)) {
          petData.push({ name: doc.data().petName, breed: doc.data().breed || "" });
        }
      }
    });

    setPetNames(petData); // Save as array of objects
  };

  // Fetch appointments for the current user
  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const querySnapshot = await getDocs(collection(db, "appointmentInfo"));
      const userAppointments = [];
      querySnapshot.forEach((doc) => {
        const appointmentData = doc.data();
        if (appointmentData.userId === user.uid) {
          userAppointments.push({ id: doc.id, ...appointmentData }); // Add document ID
        }
      });
      setAppointments(userAppointments);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    }
  };

  // Fetch data when the user changes
  useEffect(() => {
    if (user) {
      fetchPetNames();
      fetchAppointments();
    }
  }, [user]);

  // Handle pet selection change
  const handlePetChange = (e) => {
    const selectedPetName = e.target.value;
    if (selectedPetName === "Other") {
      setIsNewPet(true);
      setPetName(""); // Clear input for new pet name
      setBreed("");   // Clear input for new breed
    } else {
      setIsNewPet(false);
      setPetName(selectedPetName);

      // Find the selected pet's breed
      const selectedPet = petNames.find((pet) => pet.name === selectedPetName);
      setBreed(selectedPet ? selectedPet.breed : ""); // Set breed or default to empty
    }
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedBreed = isNewPet ? breed : petNames.find(pet => pet.name === petName).breed;
      const docRef = await addDoc(collection(db, "appointmentInfo"), {
        petName,
        breed: selectedBreed,
        date,
        time,
        type,
        userId: user.uid,
      });
      console.log("Appointment entered: ", docRef.id);

      setStatus("Appointment added successfully!");
      setPetName("");
      setBreed("");
      setDate("");
      setTime("");
      setType("");
      fetchAppointments(); // Refresh appointments
    } catch (error) {
      console.error("Error adding appointment info:", error);
      setStatus("Failed to add appointment.");
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteDoc(doc(db, "appointmentInfo", appointmentId)); // Use the correct ID
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId)); // Update state
      setStatus("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment: ", error);
      setStatus("Failed to delete appointment.");
    }
  };

  return (
    <div className="pt-20">
      <Navbar />

      <h1>Manage Appointments</h1>
      {user ? ( // Check if user is logged in
        <form onSubmit={handleAppointmentSubmit} className="mt-16">
          <label htmlFor="pet">Select a Pet:</label>
          <select
            id="pet"
            value={isNewPet ? "Other" : petName}
            onChange={handlePetChange}
            required
          >
            <option value="">-- Select a Pet --</option>
            {Array.from(new Set(petNames.map(pet => pet.name))).map((petName, index) => (
              <option key={index} value={petName}>
                {petName}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {isNewPet && (
            <div>
              <input
                type="text"
                placeholder="Enter new pet name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
              />
            </div>
          )}

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            required
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            required
          />
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type (e.g., Grooming)"
            required
          />
          <button type="submit">Add Appointment</button>
        </form>
      ) : (
        <p>Please log in to manage your appointments.</p> // Message when not logged in
      )}
      <p>{status}</p>

      <h2>Your Appointments</h2>
      {user ? (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id}>
              <img src={getBreedImage(appt.breed)} alt={appt.breed} className="breed-image" />
              {appt.type} for {appt.petName}{" "}
              {appt.breed && `(${appt.breed})`} on {appt.date} at {appt.time}
              <button onClick={() => handleDeleteAppointment(appt.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Please log in to view your appointments.</p> // Message when not logged in
      )}
    </div>
  );
};

export default Appointment;