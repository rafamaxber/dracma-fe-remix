import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useReducer } from 'react';
import { LuShoppingBag, LuRefreshCcwDot, LuFilePlus2 } from "react-icons/lu";
import MasterPage from "~/components/master-page/MasterPage";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AuthCookie } from '~/data/auth/user-auth-cookie';
import { ProductListAll } from '~/data/product/product-list-all';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const results = await new ProductListAll().listAll(String(accessToken), { page: 1, perPage: 50 });

  return json(results);
};


function MiniBtn({ label, icon }) {
  return (
    <a className="flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium text-center align-middle transition-colors border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" href="#t">
      <span className="w-5 m-auto">{icon}</span>
      <span className="block">
        {label}
      </span>
    </a>
  )
}

enum ActionTypes {
  ADD_PRODUCT = 'add_product',
  REMOVE_PRODUCT = 'remove_product',
  SET_CLIENT = 'set_client',
  SET_SELLER = 'set_seller',
  SET_DISCOUNT = 'set_discount',
  SET_TOTAL = 'set_total',
}

const initialState: OrderStateType = {
  orderItems: {},
  client: '',
  seller: '',
  total: 0,
  discount: 0,
}

interface OrderStateType {
  orderItems?: Record<string, {
    quantity: number;
    discount: number;
    surcharge: number;
    price: number;
    total: number;
  }>;
  client: string;
  seller: string;
  total: number;
  discount: number;
}

type AddProductActionType = {
  type: ActionTypes.ADD_PRODUCT;
  payload: {
    id: string;
    price: number;
    quantity: number;
  }
}

type OrderActionsType = AddProductActionType;

function orderReducer(state: OrderStateType, action: OrderActionsType): OrderStateType {
  switch (action.type) {
    case ActionTypes.ADD_PRODUCT: {
      const currentItem = state.orderItems?.[action.payload.id];

      if (currentItem) {
        return {
          ...state,
          orderItems: {
            ...state.orderItems,
            [action.payload.id]: {
              ...currentItem,
              quantity: currentItem.quantity + action.payload.quantity,
              total: currentItem.price * (currentItem.quantity + action.payload.quantity),
            }
          }
        };
      }

      state.orderItems = {
        ...state.orderItems,
        [action.payload.id]: {
          quantity: 0,
          discount: 0,
          surcharge: 0,
          price: action.payload.price,
          total: action.payload.price * action.payload.quantity,
        }
      };

      return state;
    }

    default:
      return state;
  }
}

function useOrder() {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  const addProduct = (payload) => {

    dispatch({ type: ActionTypes.ADD_PRODUCT, payload });
  }

  const getTotalOrder = () => {
    if (state.orderItems) {
      return Object.values(state.orderItems).reduce((acc, item) => acc + item.total, 0);
    }

    return 0;
  }

  const getProductQuantity = (id: string) => {
    return state.orderItems?.[id]?.quantity || 0;
  }

  return {
    state,
    addProduct,
    getProductQuantity,
    getTotalOrder
  }
}

export default function Index() {
  const { addProduct, getProductQuantity, getTotalOrder } = useOrder();
  const { results } = useLoaderData<typeof loader>()

  function handleAddProduct(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const id = event.currentTarget.dataset.id;
    const price = event.currentTarget.dataset.price;

    addProduct({
      id: String(id),
      price: Number(price),
      quantity: 1,
    });
  }

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <div className="flex flex-col w-full h-real-full">
          <div className="sticky top-0 z-10 flex-none p-2 top-navigation bg-card text-card-foreground">
            <div className="space-y-2">
              <div className="relative flex">
                <Input placeholder="Buscar item" className="my-2" />
              </div>
              <div className="flex gap-2">
                <MiniBtn label="Novo Pedido" icon={<LuShoppingBag size={20} />}/>
                <MiniBtn label="Devolução" icon={<LuRefreshCcwDot size={20} />}/>
                <MiniBtn label="Salvar Pedido" icon={<LuFilePlus2 size={20} />}/>
              </div>
            </div>
          </div>

          <div className="flex-grow gap-2 py-4 space-y-2 overflow-auto text-xs item-list">
              {
                results.map((product) => (
                  <button className="flex w-full p-2 align-middle bg-card text-card-foreground" key={product.id} data-price={product.price_sell} data-id={product.id} onClick={handleAddProduct}>
                    <span className="flex-none block w-20 p-2 mr-4 rounded-sm image bg-slate-50">
                      {/* <img src={product.image} alt={product.name} /> */}
                      <img src="https://prd.place/60" alt={product.name} />
                    </span>
                    <span className="flex-grow block text-left context">
                      <span className="block font-semibold">{product.name}</span>
                      <span className='block'>{product.code}</span>

                      <div className='flex justify-between mt-4'>
                        <span className='block'>R$ {product.price_sell}</span>
                        <span className='block'>x{getProductQuantity(String(product.id))}</span>
                      </div>
                    </span>
                  </button>
                ))
              }
          </div>

          <div className="flex-none footer">
            <Input placeholder="Nome cliente" />
            <Input placeholder="Nome Vendedor" />

            <div className="total">
              <div>Total: R$ {getTotalOrder()}</div>
            </div>
            <Button>Criar Pedido</Button>
          </div>
        </div>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
