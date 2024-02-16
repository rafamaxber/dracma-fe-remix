import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useReducer } from 'react';
import { LuShoppingBag, LuRefreshCcwDot, LuFilePlus2, LuPlusCircle, LuMinusCircle } from "react-icons/lu";
import MasterPage from "~/components/master-page/MasterPage";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AuthCookie } from '~/data/auth/user-auth-cookie';
import { ProductListAll } from '~/data/product/product-list-all';
import { ProductDataTable } from '~/data/product/protocols';
import { formatCurrency } from '~/lib/formatCurrency';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const results = await new ProductListAll().listAll(String(accessToken), { page: 1, perPage: 50 });

  return json(results);
};


function MiniBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
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

type RemoveProductActionType = {
  type: ActionTypes.REMOVE_PRODUCT;
  payload: {
    id: string;
    price: number;
    quantity: number;
  }
}

type OrderActionsType = AddProductActionType | RemoveProductActionType;

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

    case ActionTypes.REMOVE_PRODUCT: {
      const currentItem = state.orderItems?.[action.payload.id];

      if (currentItem) {
        if (currentItem.quantity <= 0) {
          return state;
        }

        return {
          ...state,
          orderItems: {
            ...state.orderItems,
            [action.payload.id]: {
              ...currentItem,
              quantity: currentItem.quantity - action.payload.quantity,
              total: currentItem.price * (currentItem.quantity - action.payload.quantity),
            }
          }
        };
      }

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

  const removeProduct = (payload) => {

    dispatch({ type: ActionTypes.REMOVE_PRODUCT, payload });
  }

  const getTotalOrder = () => {
    if (state.orderItems) {
      const value = Object.values(state.orderItems).reduce((acc, item) => acc + item.total, 0);

      return formatCurrency({
        value: String(value),
      })
    }

    return formatCurrency({
      value: String(0),
    });
  }

  const getProductQuantity = (id: string): number => {
    return Number(state.orderItems?.[id]?.quantity || 0);
  }

  return {
    removeProduct,
    state,
    addProduct,
    getProductQuantity,
    getTotalOrder
  }
}

export default function Index() {
  const { addProduct, getProductQuantity, removeProduct, getTotalOrder } = useOrder();
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

  function handleRemoveProduct(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const id = event.currentTarget.dataset.id;
    const price = event.currentTarget.dataset.price;

    removeProduct({
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

          <div className="flex-grow gap-2 space-y-2 overflow-auto text-xs item-list">
            {
              results.map((product) => (
                <div key={product.id} className='p-2 m-2 mb-5 border rounded-sm bg-card text-card-foreground border-secondary'>
                  <button className="flex w-full align-middle transition-all active:scale-95" data-price={product.price_sell} data-id={product.id} onClick={handleAddProduct}>
                    <span className="flex-none block w-20 p-2 mr-4 rounded-sm image bg-slate-50">
                      {/* <img src={product.image} alt={product.name} /> */}
                      <img src="https://prd.place/60" alt={product.name} />
                    </span>
                    <span className="flex-grow block text-left context">
                      <span className="block font-semibold">{product.name}</span>
                      <span className='block'>{product.code}</span>

                      <div className='flex justify-between mt-4'>
                        <span className='block'>{formatCurrency({ value: String(product.price_sell) })}</span>
                      </div>
                    </span>
                  </button>

                  <div className="flex mt-3">
                    <Button size="icon" variant="outline" className='border-r-0 rounded-r-none' data-price={product.price_sell} data-id={product.id} onClick={handleRemoveProduct}>
                      <LuMinusCircle size={20} />
                    </Button>
                    <Button className='w-full border-l-0 border-r-0 rounded-l-none rounded-r-none' variant="outline">
                      <ProductSummary productData={product} quantity={getProductQuantity(String(product.id))} />
                    </Button>
                    <Button size="icon" variant="outline" className='border-l-0 rounded-l-none' data-price={product.price_sell} data-id={product.id} onClick={handleAddProduct}>
                      <LuPlusCircle size={20} />
                    </Button>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="flex justify-between p-4 align-middle footer">
            {/* TODO: Implementar validação do pedido, onde será necessário informar o cliente, vendedor e data de vencimento, pode ser um modal de pagina inteira. */}
            {/* <Input placeholder="Nome cliente" type='text'/>
            <Input placeholder="Nome Vendedor" type='text' />
            <Input placeholder="Date de vencimento" type='date' /> */}

            <div className="total">
              <div className='text-sm'>Total:</div>
              <div className='text-lg font-bold'>{getTotalOrder()}</div>
            </div>
            <Button>Criar Pedido</Button>
          </div>
        </div>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}

function ProductSummary({ productData, quantity }: { productData: ProductDataTable, quantity: number }) {
  const priceSell = productData?.price_sell || 0;
  const price = formatCurrency({ value: String(priceSell) })
  const total = formatCurrency({ value: String(quantity * priceSell) })

  if (quantity > 0) {
    return (
      `${quantity} x ${price} = ${total}`
    )
  }

  return 0;
}
