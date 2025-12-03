import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart";
import { Layout } from "@/components/layout";
import { VisitorTracker } from "@/components/visitor-tracker";
import { DiscountPopup } from "@/components/discount-popup";
import Home from "@/pages/home";
import Category from "@/pages/category";
import Product from "@/pages/product";
import Checkout from "@/pages/checkout";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin}/>
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home}/>
            <Route path="/category/:type" component={Category}/>
            <Route path="/product/:id" component={Product}/>
            <Route path="/checkout" component={Checkout}/>
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <VisitorTracker />
        <DiscountPopup />
        <Router />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
