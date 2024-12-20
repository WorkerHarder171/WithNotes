// import { useState } from "react";
// import { BsChevronDown, BsChevronUp } from "react-icons/bs";
// import Checkbox from "@mui/material";

// interface NotesCategoryProps {
//   showCategory: boolean;
//   setShowCategory: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export default function NotesCategory({
//   categories,
//   textNotes,
//   setTextNotes,
// }: NotesCategoryProps) {
//   const [showCategory, setShowCategory] = useState<boolean>(false);
//   return (
//     <div className="mt-7 w-full">
//       <div
//         onClick={() => setShowCategory((prev) => !prev)}
//         className="relative p-4 flex justify-between text-[#828282]
//         z-20 bg-white rounded-xl border border-[#828282] cursor-pointer"
//       >
//         <p className="my-auto text-sm font-medium">Kategori</p>
//         {!showCategory ? (
//           <BsChevronDown className="text-2xl" />
//         ) : (
//           <BsChevronUp className="text-2xl" />
//         )}
//       </div>

//       <div>
//         {showCategory && (
//           <div className="grid grid-cols-2 gap-y-5 px-6 pb-6 pt-12 mt-[-32px] rounded-xl border border-[#828282]">
//             {categories &&
//               categories?.map((category, index) => (
//                 <Checkbox
//                   onChange={(event) =>
//                     setTextNotes((prev) => ({
//                       ...prev,
//                       category_id: event.target.checked
//                         ? [...prev.category_id, category.id]
//                         : prev.category_id
//                             .filter((id) => id !== category.id)
//                             .filter(
//                               (item) => item.category !== category.trash_type
//                             ),
//                     }))
//                   }
//                   isChecked={textNotes.category_id.includes(category.id)}
//                   key={index}
//                   colorScheme={"mainGreen"}
//                   className="flex-1 w-fit"
//                 >
//                   {category.trash_type}
//                 </Checkbox>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
