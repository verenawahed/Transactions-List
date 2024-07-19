import { useEffect, useState } from "react";
import "./App.css";
import Error from "./imgs/error.png";
import NotFound from "./imgs/not-found.png";
import axios from "axios";
import Modal from "./components/Modal";
import Spinner from "./components/spinner";

function App() {
  const [Loading, setLoading] = useState(false);
  const [IsError, setError] = useState(false);
  const [Data, setData] = useState();
  const [SearchCustomar, setSearchCustomar] = useState("");
  const [SeachTransactionAmount, setSeachTransactionAmount] = useState("");
  const [filterData, setfilterData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ActiveCustomar, setActiveCustomar] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const FetchData = async () => {
    setLoading(true);
    try {
      const data = await axios.get(
        "https://mocki.io/v1/a73d7d4d-32b2-4f1d-9d07-7a2ac6771b0f"
      );
      console.log(data.data?.customers[0]?.name);
      setData(data?.data);
      setfilterData(data?.data?.customers);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  const HandleSearchCustomar = (event) => {
    setSearchCustomar(event.target.value);
    const filtered = Data?.customers?.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );

    if (filtered.length != 0) {
      setfilterData(filtered);
    } else {
      setfilterData([]);
    }
    if (event.target.value.length === 0) {
      setfilterData(Data?.customers);
    }
  };

  const HandleSearchAmounts = (event) => {
    const ReqextNumber = /[ 0-9]+([0-9])*$/;

    if (ReqextNumber.test(event.target.value)) {
      setSeachTransactionAmount(event.target.value);
      const filterCustomars = [];
      const filteredAmounts = Data?.transactions?.filter(
        (item) => item.amount == event.target.value
      );
      filteredAmounts.map((transactionData) => {
        Data?.customers?.map((item) => {
          if (item.id === transactionData.customer_id) {
            filterCustomars.push(item);
          }
        });
      });

      if (filterCustomars.length != 0) {
        setfilterData(filterCustomars);
      } else {
        setfilterData([]);
      }

      if (event.target.value.length === 0) {
        setfilterData(Data?.customers);
      }
    }

  };

  const HandleClickRow = (data) => {
    const TransactionForCustomar = Data?.transactions?.filter(
      (item) => item.customer_id == data.id
    );
    openModal();
    setActiveCustomar({
      transaction: TransactionForCustomar,
      customarData: data,
    });
  };

  const RenderData = () => {
    return IsError ? (
      <div className="empty-container">
        <img src={Error} width={"50%"} />
        <h1>Error When Get Data</h1>
      </div>
    ) : filterData.length == 0 ? (
      <div className="empty-container">
        <img src={NotFound} width={"50%"} />
        <h1>There Is No Transactions</h1>
      </div>
    ) : (
      filterData?.map((item, index) => {
        return (
          <tr
            key={index}
            onClick={() => {
              HandleClickRow(item);
            }}
          >
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td className="last-filed">
              <button>Transactions</button>
            </td>
          </tr>
        );
      })
    );
  };

  return (
    <div className="App">
     

      <div className="main-content">
        {/* tracking */}
       

        {Loading ? (
          <Spinner />
        ) : (
          <div className="details">
            <h2>Transactions List</h2>

            {/* search btns */}
            <div className="search-card">
              <div className="card">
                <p>Search By client Name</p>
                <input
                  placeholder="ex: Verena Wahed"
                  onChange={HandleSearchCustomar}
                  value={SearchCustomar}
                />
              </div>

              <div className="card">
                <p>Search By Transaction Amount</p>
                <input
                  placeholder="ex: 1000"
                  onChange={HandleSearchAmounts}
                  value={SeachTransactionAmount}
                />
              </div>
            </div>

            {/* table */}
            <div className="search-card">
              <div className="table-container">
                <h1 className="title">Transactions Summary</h1>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th className="last-filed"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    <RenderData />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        ActiveCustomar={ActiveCustomar}
      />
    </div>
  );
}

export default App;