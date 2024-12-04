import React, { useState ,useEffect} from "react";
interface Props {   
    trigger : React.ReactElement;
    // phải taoh kiểu dữ liệu cho đúng
    menu : Array<
        {
            menuItem :  React.ReactElement;
        }
    >;
}

const DropDownFC : React.FC<Props> = ( {trigger, menu} ) => {
    const [open, setOpen] = useState(false);
  
    const handleOpen = () => {
      setOpen(!open);
    };
  
    return (
      <div className="dropdown">
        {React.cloneElement(trigger, {
          onClick: handleOpen,
        }
        )}
        {open ? (
          <ul className="ml-5">
            {menu?.map((item, index) => (
              <li key={index} className="menu-item  hover:text-red-500">
                {React.cloneElement(item.menuItem, {
                  // onClick: () => {
                  //   setOpen(false);
                  // },
                })}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };

  
  export { DropDownFC };