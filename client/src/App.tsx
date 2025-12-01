import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Category from "@/pages/category";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/category/:type" component={Category}/>
        <Route path="/checkout" component={Checkout}/>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
